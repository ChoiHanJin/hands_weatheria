const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Weather = mongoose.model('Weather');

/* GET home page. */
router.get('/', function(req, res, next) {
  Weather.find(function(err, weathers){
    for(let i = 0; i < weathers.length; i++){
      weathers[i].data = weathers[i].data[weathers[i].data.length - 1];
    }

    console.log(JSON.stringify(weathers));

    res.render('index', {
      title: '웨더리아',
      weathers: weathers
    });
  });
});

router.post('/data', function(req, res, next) {
  let carId = req.body.carId;
  let lat = req.body.lat;
  let lng = req.body.lng;
  let temperture = req.body.temperture;
  let rain = req.body.rain;
  // let humidity = humidity;
  // let dust = req.body.dust;

  Weather.findOne({carId: carId}, function(err, weather){
    // if id already exist
    if(weather !== null){
      if(weather.data.length > 50) weather.data.shift();
      let data = {
        lat: lat,
        lng: lng,
        rain: rain,
        temperture: temperture
        // data.humidity = humidity,
        // data.dust = dust
      };
      weather.data.push(data);
    }
    // new id
    else{
      weather = new Weather({
        carId: carId,
        data: {
          lat: lat,
          lng: lng,
          temperture: temperture,
          rain: rain,
          // humidity: humidity,
          // dust: dust
        }
      });
    }
    weather.save(function(err, weather){
      if(err){
        res.json({result: 0});
        return console.error(err);
      }
      console.dir(weather);
      res.json({result: 1});
    });
  });
});

module.exports = router;
