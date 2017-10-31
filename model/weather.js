var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var weatherSchema = new Schema({
  carId: Number,
  data: [{
    lat: Number,
    lng: Number,
    rain: Number,
    temperture: Number,
    humidity: Number,
    dust: Number
  }]
});

module.exports = mongoose.model('Weather', weatherSchema);