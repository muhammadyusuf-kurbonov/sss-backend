
async function dropCurrentDb() {
  // NEVER USE THIS IN PRODUCTION!!!!
  // ONLY FOR TESTS!!!!
  // MAKE SURE NODE_ENV=test OR THIS WILL DROP YOUR DEV DATABASE
  await get('mongooseClient').connection;
  await get('mongooseClient').connection.db.dropDatabase();
}


module.exports = {
  async beforeEach() {
    this.timeout(10000);
    return await dropCurrentDb();
  },
};
