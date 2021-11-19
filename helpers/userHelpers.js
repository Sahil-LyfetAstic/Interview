const db = require("../config/connection");
const collection = require("../config/collection");
const bcrypt = require("bcrypt");

module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(userData)
        .then((userId) => {
          if (userId) resolve(userId.insertedId);
          else reject(userId);
        })
        .catch((err) => {
          throw err;
        });
    });
  },
  findUser: (userId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({
          _id: userId,
        })
        .then((user) => {
          if (user) resolve(user);
          else reject(false);
        })
        .catch((err) => console.log(err));
    });
  },
  doLogin: (userData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({
          email: userData.email,
        })
        .then((user) => {
          if (!user) {
            //no user found
            response.user = false;
            resolve(response);
          } else {
            bcrypt.compare(userData.password, user.password).then((result) => {
              if (result) {
                //login success
                response.password = true;
                response.user = user
                resolve(response);
              } else {
                //login false
                response.password = false;
                resolve(response);
              }
            });
          }
        });
    });
  },
};
