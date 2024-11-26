const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    addressType: {
      type: String,
      enum: ["home", "work"],
      default: "home",
    },
  },
  {
    timestamps: true,
  }
);

const addressModel = mongoose.model("address", addressSchema);

module.exports = addressModel;
