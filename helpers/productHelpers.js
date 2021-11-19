const db = require("../config/connection");
const collection = require("../config/collection");

module.exports = {
  addProduct: (product) => {
    return new Promise(async (resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .insertOne(product)
        .then((response) => {
          if (response) resolve(response.insertedId);
          else reject(response);
        })
        .catch((err) => {
          throw err;
        });
    });
  },
  findProduct: (prodId) => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: prodId })
        .then((product) => {
          console.log(product);
        });
    });
  },
  getAllProduct: () => {
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray()
        .then((products) => {
          resolve(products)
        });
    });
  },
};
