require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');

// ============= CONFIGURATION =============
// Modify these values according to your setup
const config = {
  containerName: 'pok-db-1', // Your PostgreSQL container name
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  dumpFilePath: './mocked_test_data.sql',
};
// =======================================

const execAsync = util.promisify(exec);

class PostgresRestore {
  config: any;

  constructor(config) {
    this.config = config;
    this.validateConfig();
  }

  validateConfig() {
    const requiredFields = [
      'containerName',
      'username',
      'database',
      'dumpFilePath',
    ];
    for (const field of requiredFields) {
      if (!this.config[field]) {
        throw new Error(`Missing required configuration field: ${field}`);
      }
    }
  }

  async executeCommand(command, errorMessage) {
    try {
      const { stdout, stderr } = await execAsync(command);

      if (stderr && !stderr.includes('NOTICE:')) {
        console.warn('Command produced stderr:', stderr);
      }
      return stdout;
    } catch (error) {
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  }

  async checkPrerequisites() {
    // Check if dump file exists
    if (!fs.existsSync(this.config.dumpFilePath)) {
      throw new Error(`Dump file not found at: ${this.config.dumpFilePath}`);
    }

    // Check if container is running
    const checkContainerCmd =
      process.platform === 'win32'
        ? `docker ps --filter name=${this.config.containerName} --format "{{.Names}}"`
        : `docker ps | grep ${this.config.containerName}`;

    try {
      const result = await this.executeCommand(
        checkContainerCmd,
        'Container not found or not running',
      );
      if (!result.includes(this.config.containerName)) {
        throw new Error(
          `Container ${this.config.containerName} is not running`,
        );
      }
    } catch (error) {
      throw new Error(
        `PostgreSQL container '${this.config.containerName}' is not running`,
      );
    }
  }

  async createDatabaseIfNotExists() {
    const checkDbCmd = `docker exec ${this.config.containerName} psql -U ${this.config.username} -lqt`;

    try {
      const result = await this.executeCommand(
        checkDbCmd,
        'Error checking database existence',
      );
      const dbExists = result
        .split('\n')
        .some((line) => line.includes(this.config.database));

      if (!dbExists) {
        console.log(
          `Database ${this.config.database} does not exist. Creating...`,
        );
        await this.executeCommand(
          `docker exec ${this.config.containerName} createdb -U ${this.config.username} ${this.config.database}`,
          'Error creating database',
        );
      }
    } catch (error) {
      throw new Error(`Error managing database: ${error.message}`);
    }
  }

  async copyDumpToContainer() {
    const containerPath = `/tmp/${path.basename(this.config.dumpFilePath)}`;
    await this.executeCommand(
      `docker cp "${this.config.dumpFilePath}" ${this.config.containerName}:${containerPath}`,
      'Error copying dump file to container',
    );
  }

  async restoreDatabase() {
    const containerPath = `/tmp/${path.basename(this.config.dumpFilePath)}`;
    const isCustomFormat =
      this.config.dumpFilePath.endsWith('.backup') ||
      this.config.dumpFilePath.endsWith('.custom');

    const restoreCommand = isCustomFormat
      ? `docker exec ${this.config.containerName} pg_restore -U ${this.config.username} -d ${this.config.database} -v ${containerPath}`
      : `docker exec ${this.config.containerName} psql -U ${this.config.username} -d ${this.config.database} -f ${containerPath}`;

    await this.executeCommand(restoreCommand, 'Error restoring database');
  }

  async cleanup() {
    const containerPath = `/tmp/${path.basename(this.config.dumpFilePath)}`;
    await this.executeCommand(
      `docker exec ${this.config.containerName} rm ${containerPath}`,
      'Error cleaning up dump file from container',
    );
  }

  async restore() {
    try {
      console.log('Starting PostgreSQL restore process...');
      console.log('Using configuration:', {
        containerName: this.config.containerName,
        username: this.config.username,
        database: this.config.database,
        dumpFile: this.config.dumpFilePath,
      });

      console.log('\nChecking prerequisites...');
      await this.checkPrerequisites();

      console.log("\nCreating database if it doesn't exist...");
      await this.createDatabaseIfNotExists();

      console.log('\nCopying dump file to container...');
      await this.copyDumpToContainer();

      console.log('\nRestoring database...');
      await this.restoreDatabase();

      console.log('\nCleaning up...');
      await this.cleanup();

      console.log('\nDatabase restore completed successfully!');
    } catch (error) {
      console.error('\nDatabase restore failed:', error.message);
      process.exit(1);
    }
  }
}

// Main execution
if (require.main === module) {
  const restorer = new PostgresRestore(config);
  restorer
    .restore()
    .then(() => {
      console.log('Script execution completed.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script execution failed:', error);
      process.exit(1);
    });
}

module.exports = { PostgresRestore };
