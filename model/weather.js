var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var weatherSchema = new Schema({
  carId: Number,
  data: [{
    position: {
      lat: Number,
      lng: Number
    },
    rain: Number,
    temperture: Number,
    humidity: Number,
    dust: Number
  }]
}, {
  timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Weather', weatherSchema);