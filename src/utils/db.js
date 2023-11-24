const { MongoClient } = require("mongodb");

let dbConnect;
module.exports = {
  ConnectToDb: (cb) => {
    console.info("Starting server");
      MongoClient.connect(process.env.MONGO_URL)
      .then((client) => {
        dbConnect = client.db();
        console.info("Connected to MongoDB");
        return cb();
      })
      .catch((err) => {
        console.error(err);
        cb(err);
      });
  },
  getDb: () => dbConnect,
};
