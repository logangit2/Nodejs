const mongoose = require("mongoose");

let foodSchema = mongoose.Schema({}, { timestamps: true });

let foodModel = mongoose.model("foods", foodSchema);

module.exports = foodModel;
