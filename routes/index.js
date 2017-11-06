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

    res.render('index', {
      title: '웨더리아',
      weathers: weathers
    });
  });
});

router.get('/data', function(req, res, next) {
  Weather.find(function(err, weathers){
    for(let i = 0; i < weathers.length; i++){
      weathers[i].data = weathers[i].data[weathers[i].data.length - 1];
    }

    res.json(weathers);
  });
});

router.post('/data', function(req, res, next) {
  let carId = req.body.carId || null;
  let lat = req.body.lat || null;
  let lng = req.body.lng || null;
  let temperture = req.body.temperture || null;
  let rain = req.body.rain || null;
  let humidity = humidity || null;
  // let dust = req.body.dust;

  Weather.findOne({carId: carId}, function(err, weather){
    // if id already exist
    if(weather !== null){
      if(weather.data.length > 50) weather.data.shift();
      let data = {
        position: {
          lat: lat,
          lng: lng
        },
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
          position: {
            lat: lat,
            lng: lng
          },
          rain: rain,
          temperture: temperture,
          //humidity: humidity
        }
      });
    }
    weather.save(function(err, weather){
      if(err){
        res.json({result: 0});
        return console.error(err);
      }
      res.json({result: 1});
    });
  });
});

router.get('/data/here', function(req, res, next) {
  let lat = req.query.lat || null;
  let lng = req.query.lng || null;
  let earthRadiusM = 6371000;
  
  console.log("lat: " + lat);
  console.log("lng: " + lng);
  
  Weather.find(function(err, weathers){
    for(let i = 0; i < weathers.length; i++){
      weathers[i].data = weathers[i].data[weathers[i].data.length - 1];
      let distance = earthRadiusM * Math.sqrt(Math.pow((lat - weathers[i].data[0].position.lat), 2) + Math.pow((lng - weathers[i].data[0].position.lng), 2));
      console.log("distance: " + distance);
    }
    res.json(weathers);
  });
});

module.exports = router;
