const mongoose = require("mongoose");

let trackingSchema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    foodid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "foods",
      required: true,
    },
    eatenDate: {
      type: String,
      default: new Date().toLocaleDateString(),
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
  },
  { timestamps: true }
);

const trakingModel = mongoose.model("trackings", trackingSchema);

module.exports = trakingModel;
