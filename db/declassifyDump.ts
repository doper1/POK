const FS = require('fs');
const Path = require('path');
const readline = require('readline');
const { faker } = require('@faker-js/faker');

class PostgresMocker {
  private inputFile: string;
  private outputFile: string;
  private numberCache: Map<string, string>;
  private textCache: Map<string, string>;
  private userCache: Map<string, string>;
  private writeStream: any;
  private currentTable: string | null;
  private currentColumns: string[] | null;
  private inCopyStatement: boolean;

  constructor(inputFile: string, outputFile: string) {
    this.inputFile = inputFile;
    this.outputFile = outputFile;
    this.numberCache = new Map();
    this.textCache = new Map();
    this.userCache = new Map();
    this.writeStream = FS.createWriteStream(outputFile);
    this.currentTable = null;
    this.currentColumns = null;
    this.inCopyStatement = false;
  }

  private generateMockNumber(original: string): string {
    if (this.numberCache.has(original)) {
      return this.numberCache.get(original)!;
    }

    const length = original.length;
    let mock: string;

    if (original.includes('.')) {
      const [integer, decimal] = original.split('.');
      const mockInteger = this.generateMockNumber(integer);
      const mockDecimal = this.generateMockNumber(decimal);
      mock = `${mockInteger}.${mockDecimal}`;
    } else {
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
      mock = Math.floor(Math.random() * (max - min + 1) + min).toString();
    }

    this.numberCache.set(original, mock);
    return mock;
  }

  private generateMockText(original: string): string {
    if (this.textCache.has(original)) {
      return this.textCache.get(original)!;
    }

    const words = original.split(/\s+/);
    let mock = words.map(() => faker.word.sample()).join(' ');

    if (original === original.toUpperCase()) {
      mock = mock;
    } else if (original[0] === original[0].toUpperCase()) {
      mock = mock.charAt(0).toUpperCase() + mock.slice(1);
    }

    this.textCache.set(original, mock);
    return mock;
  }

  private anonymizeUser(user: string): string {
    if (this.userCache.has(user)) {
      return this.userCache.get(user)!;
    }
    const mockUser = `user_${this.userCache.size + 1}`;
    this.userCache.set(user, mockUser);
    return mockUser;
  }

  private removeComments(line: string): string {
    // Remove single-line comments
    line = line.replace(/--.*$/, '');

    // If the line is now empty or only whitespace, return empty string
    if (line.trim() === '') {
      return '';
    }

    return line;
  }

  private processSQLLine(line: string): string {
    // Skip if we're in a COPY statement
    if (this.inCopyStatement) {
      return line;
    }

    // Remove comments first
    line = this.removeComments(line);
    if (!line) return '';

    // Anonymize user names in common PostgreSQL commands
    line = line.replace(
      /(OWNER TO|ALTER USER|CREATE USER|DROP USER|GRANT TO|REVOKE FROM) (\w+)/gi,
      (match, command, user) => {
        return `${command} ${this.anonymizeUser(user)}`;
      },
    );

    return line;
  }

  private processCopyValue(value: string, columnName: string): string {
    if (value === '\\N' || value === '') {
      return value;
    }

    if (value.startsWith('{') && value.endsWith('}')) {
      return value;
    }

    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        value,
      )
    ) {
      return value;
    }

    if (/^-?\d*\.?\d+$/.test(value)) {
      return this.generateMockNumber(value);
    }

    if (value === 't' || value === 'f') {
      return value;
    }

    if (columnName === 'status' || columnName === 'type') {
      return value;
    }

    return this.generateMockText(value);
  }

  private parseCopyStatement(line: string): void {
    const match = line.match(/COPY\s+(\w+\.)?(\w+)\s*\((.*?)\)/);
    if (match) {
      this.currentTable = match[2];
      this.currentColumns = match[3].split(',').map((col) => col.trim());
      this.inCopyStatement = true;
    }
  }

  private processCopyLine(line: string): string {
    if (!this.currentColumns) {
      return line;
    }

    if (line === '\\.') {
      this.inCopyStatement = false;
      this.currentTable = null;
      this.currentColumns = null;
      return line;
    }

    const values = line.split('\t');
    const mockedValues = values.map((value, index) =>
      this.processCopyValue(value, this.currentColumns![index]),
    );

    return mockedValues.join('\t');
  }

  async process(): Promise<void> {
    console.log('Starting SQL dump processing...');

    this.writeStream.write("CREATE USER user_1 WITH PASSWORD 'password';\n");

    const fileStream = FS.createReadStream(this.inputFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let lineCount = 0;
    let mockedCount = 0;
    let commentsRemoved = 0;

    for await (const line of rl) {
      lineCount++;

      if (lineCount % 1000 === 0) {
        console.log(`Processed ${lineCount} lines...`);
      }

      if (line.startsWith('COPY ')) {
        this.parseCopyStatement(line);
        const processedLine = this.processSQLLine(line);
        if (processedLine) {
          this.writeStream.write(processedLine + '\n');
        }
      } else if (this.inCopyStatement) {
        const mockedLine = this.processCopyLine(line);
        this.writeStream.write(mockedLine + '\n');
        mockedCount++;
      } else {
        const processedLine = this.processSQLLine(line);
        if (processedLine) {
          this.writeStream.write(processedLine + '\n');
        } else {
          commentsRemoved++;
        }
      }
    }

    this.writeStream.end();

    console.log('\nProcessing complete:');
    console.log(`Total lines processed: ${lineCount}`);
    console.log(`Data lines mocked: ${mockedCount}`);
    console.log(`Comments removed: ${commentsRemoved}`);
    console.log(`Users anonymized: ${this.userCache.size}`);
    console.log(`Output written to: ${this.outputFile}`);
  }
}

async function main() {
  try {
    try {
      require('@faker-js/faker');
    } catch (e) {
      console.error('Required package @faker-js/faker is not installed.');
      console.log('Please install it using: npm install @faker-js/faker');
      process.exit(1);
    }

    const inputFile = process.argv[2];
    const outputFile = process.argv[3] || 'mocked_test_data.sql';

    if (!inputFile) {
      console.error('Usage: node script.js <input-file> [output-file]');
      process.exit(1);
    }

    if (!FS.existsSync(inputFile)) {
      console.error(`Input file not found: ${inputFile}`);
      process.exit(1);
    }

    const mocker = new PostgresMocker(inputFile, outputFile);
    await mocker.process();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PostgresMocker;
