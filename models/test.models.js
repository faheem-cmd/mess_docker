const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  house: String,
});

const AddressSchema = new mongoose.Schema({
  city: String,
  street: String,
  place: [
    {
      type: placeSchema,
    },
  ],
});

const testSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: String,
  },
  address: [
    {
      type: AddressSchema,
    },
  ],
});

module.exports = mongoose.model("test", testSchema);
