import app from '../src/app';


async function dropCurrentDb() {
  // NEVER USE THIS IN PRODUCTION!!!!
  // ONLY FOR TESTS!!!!
  // MAKE SURE NODE_ENV=test OR THIS WILL DROP YOUR DEV DATABASE
  await app.get('mongooseClient').connection;
  if (app.get('mongooseClient').connection.db) 
    await app.get('mongooseClient').connection.db.dropDatabase();
}


module.exports.mochaHooks = {
  async beforeEach() {
    this.timeout(10000);
    return await dropCurrentDb();
  },

  beforeAll(done: Mocha.Done) {
    if (!app.listen())
      app.listen(app.get('port'));
    done();
  },
};
