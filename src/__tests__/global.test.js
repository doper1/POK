const { connection } = require('../../db/db.ts');

test('global tests setup', () => {
  expect(true).toBe(true);
});

afterAll(async () => {
  connection.end();
});
