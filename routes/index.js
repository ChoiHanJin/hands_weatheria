const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Weather = mongoose.model('Weather');

/* GET home page. */
router.get('/', function(req, res, next) {
  let lat = req.query.lat * 1 || 0;
  let lng = req.query.lng * 1 || 0;
  let zoomSize = req.query.z * 1 || 17;
  
  if(lat === 0 && lng === 0){
    Weather.find(function(err, weathers){
      let data = [];
      
      for(let i = 0; i < weathers.length; i++){
        data[i] = weathers[i].data[weathers[i].data.length - 1];
      }
  
      res.render('index', {
        title: '웨더리아',
        weathers: data,
        lat: lat,
        lng: lng
      });
    });
  }
  else{
    let latWidth19 = 0.002012;
    let lngWidth19 = 0.005147;
    let latWidth = latWidth19 * Math.pow(2, 19 - zoomSize);
    let lngWidth = lngWidth19 * Math.pow(2, 19 - zoomSize);
    let weathersMap = {0: [], 1: [], 2: [], 3: [], 4: [],
                       5: [], 6: [], 7: [], 8: [], 9: [],
                       10: [], 11: [], 12: [], 13: [], 14: []};
    let data = [];
    
    Weather.find(function(err, weathers){
      for(let i = 0; i < weathers.length; i++){
        weathers[i].data = weathers[i].data[weathers[i].data.length - 1];
        let top  = weathers[i].data[0].position.lat - lat;
        let left = weathers[i].data[0].position.lng - lng;
        mapY = latWidth / 6 < top && top < latWidth / 2 ? 0
          :-1 * latWidth / 6 < top && top < latWidth / 6 ? 1
          :-1 * latWidth / 2 < top && top < -1 * latWidth / 6 ? 2
          : null;
        mapX = 3 * latWidth / 10 < left && left <      lngWidth / 2 ? 4
          :        lngWidth / 10 < left && left <  3 * lngWidth / 10 ? 3
          :   -1 * lngWidth / 10 < left && left <      lngWidth / 10 ? 2
          :   -3 * lngWidth / 10 < left && left < -1 * lngWidth / 10 ? 1
          :   -1 * lngWidth / 2  < left && left < -3 * lngWidth / 10 ? 0
          : null;
        if(mapX !== null && mapY !== null){
          weathersMap[5 * mapY + mapX].push(weathers[i].data[0]);
        }
      }
      for(let i = 0; i < 3; i++){
        for(let j = 0; j < 5; j++){
          let temperatureSum = 0;
          let rainSum = 0;
          let humiditySum = 0;
          let dustSum = 0;
          let dustCount = 0;
          if(weathersMap[5 * i + j].length !== 0){
            for(let k = 0; k < weathersMap[5 * i + j].length; k++){
              temperatureSum += weathersMap[5 * i + j][k].temperature;
              rainSum += weathersMap[5 * i + j][k].rain;
              humiditySum += weathersMap[5 * i + j][k].humidity;
              if(weathersMap[5 * i + j][k].dust){
                dustSum += weathersMap[5 * i + j][k].dust;
                dustCount++;
              }
            }
            data[5 * i + j] = {
              humidity: humiditySum / weathersMap[5 * i + j].length,
              temperature: temperatureSum / weathersMap[5 * i + j].length,
              rain: rainSum / weathersMap[5 * i + j].length,
              dust: dustSum / dustCount,
              position: {
                lat: lat + (((1 - i) * latWidth) / 3),
                lng: lng + (((j - 2) * lngWidth) / 5),
              }
            }
          }
        }
      }
      res.render('index', {
        title: '웨더리아',
        weathers: data,
        lat: lat,
        lng: lng
      });
    });
  }
});

router.get('/data', function(req, res, next) {
  let lat = req.query.lat * 1 || 0;
  let lng = req.query.lng * 1 || 0;
  let zoomSize = req.query.z * 1 || 17;
  
  if(lat === 0 && lng === 0){
    Weather.find(function(err, weathers){
      for(let i = 0; i < weathers.length; i++){
        weathers[i].data = weathers[i].data[weathers[i].data.length - 1];
      }
      let data = [];
      
      for(let i = 0; i < weathers.length; i++){
        data[i] = weathers[i].data[weathers[i].data.length - 1];
      }
      res.json(data);
    });
  }
  else{
    let latWidth19 = 0.002012;
    let lngWidth19 = 0.005147;
    let latWidth = latWidth19 * Math.pow(2, 19 - zoomSize);
    let lngWidth = lngWidth19 * Math.pow(2, 19 - zoomSize);
    let weathersMap = {0: [], 1: [], 2: [], 3: [], 4: [],
                       5: [], 6: [], 7: [], 8: [], 9: [],
                       10: [], 11: [], 12: [], 13: [], 14: []};
    let data = [];
    
    Weather.find(function(err, weathers){
      for(let i = 0; i < weathers.length; i++){
        weathers[i].data = weathers[i].data[weathers[i].data.length - 1];
        let top  = weathers[i].data[0].position.lat - lat;
        let left = weathers[i].data[0].position.lng - lng;
        mapY = latWidth / 6 < top && top < latWidth / 2 ? 0
          :-1 * latWidth / 6 < top && top < latWidth / 6 ? 1
          :-1 * latWidth / 2 < top && top < -1 * latWidth / 6 ? 2
          : null;
        mapX = 3 * latWidth / 10 < left && left <      lngWidth / 2 ? 4
          :        lngWidth / 10 < left && left <  3 * lngWidth / 10 ? 3
          :   -1 * lngWidth / 10 < left && left <      lngWidth / 10 ? 2
          :   -3 * lngWidth / 10 < left && left < -1 * lngWidth / 10 ? 1
          :   -1 * lngWidth / 2  < left && left < -3 * lngWidth / 10 ? 0
          : null;
        if(mapX !== null && mapY !== null){
          weathersMap[5 * mapY + mapX].push(weathers[i].data[0]);
        }
      }
      for(let i = 0; i < 3; i++){
        for(let j = 0; j < 5; j++){
          let temperatureSum = 0;
          let rainSum = 0;
          let humiditySum = 0;
          let dustSum = 0;
          let dustCount = 0;
          if(weathersMap[5 * i + j].length !== 0){
            for(let k = 0; k < weathersMap[5 * i + j].length; k++){
              temperatureSum += weathersMap[5 * i + j][k].temperature;
              rainSum += weathersMap[5 * i + j][k].rain;
              humiditySum += weathersMap[5 * i + j][k].humidity;
              if(weathersMap[5 * i + j][k].dust){
                dustSum += weathersMap[5 * i + j][k].dust;
                dustCount++;
              }
            }
            data[5 * i + j] = {
              humidity: humiditySum / weathersMap[5 * i + j].length,
              temperature: temperatureSum / weathersMap[5 * i + j].length,
              rain: rainSum / weathersMap[5 * i + j].length,
              dust: dustSum / dustCount,
              position: {
                lat: lat + (((1 - i) * latWidth) / 3),
                lng: lng + (((j - 2) * lngWidth) / 5),
              }
            }
          }
        }
      }
      res.json(data);
    });
  }
});

router.post('/data', function(req, res, next) {
  let carId = req.body.carId || null;
  let lat = req.body.lat || null;
  let lng = req.body.lng || null;
  let temperature = req.body.temperature || null;
  let rain = req.body.rain || null;
  let humidity = req.body.humidity || null;
  
  Weather.findOne({carId: carId}, function(err, weather){
    let dust = null;
    
    // if id already exist
    if(weather !== null){
      dust =  weather.data[weather.data.length - 1].dust;
      if(weather.data.length > 50) weather.data.shift();
      let data = {
        position: {
          lat: lat,
          lng: lng
        },
        dust: dust,
        rain: rain,
        temperature: temperature,
        humidity: humidity
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
          temperature: temperature,
          humidity: humidity,
          dust: null
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

router.post('/data/dust', function(req, res, next) {
  let carId = req.body.carId || null;
  let lat = req.body.lat || null;
  let lng = req.body.lng || null;
  let dust = req.body.dust || null;
  let temperature =  null;
  let rain = null;
  let humidity = null;
  
  Weather.findOne({carId: carId}, function(err, weather){
    if(weather !== null){
      if(weather.data.length > 50) weather.data.shift();
      let data = {
        position: {
          lat: weather.data[weather.data.length - 1].position.lat,
          lng: weather.data[weather.data.length - 1].position.lng
        },
        dust: dust,
        rain: weather.data[weather.data.length - 1].rain,
        temperature: weather.data[weather.data.length - 1].temperature,
        humidity: weather.data[weather.data.length - 1].humidity
      };
      weather.data.push(data);
      
      weather.save(function(err, weather){
        if(err){
          res.json({result: 0});
          return console.error(err);
        }
        res.json({result: 1});
      });
    }
  });
});

router.get('/data/here', function(req, res, next) {
  let lat = req.query.lat || null;
  let lng = req.query.lng || null;
  let distanceSort = [];
  
  function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }
  
  function distanceInMBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    var earthRadiusM = 6371000;
  
    var dLat = degreesToRadians(lat2-lat1);
    var dLon = degreesToRadians(lon2-lon1);
  
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return earthRadiusM * c;
  }
  
  if(lat !== null && lng !== null){
    Weather.find(function(err, weathers){
      let  first, second, result, dust;
      
      for(let i = 0; i < weathers.length; i++){
        weathers[i].data = weathers[i].data[weathers[i].data.length - 1];
        weathers[i].data[0].distance = distanceInMBetweenEarthCoordinates(lat, lng, weathers[i].data[0].position.lat, weathers[i].data[0].position.lng);
        let distance = weathers[i].data[0].distance;
        if(i === 0){
          distanceSort.push({index: i, distance: distance});
        }
        else{
          if(distance <= distanceSort[distanceSort.length - 1].distance){
            distanceSort.push({index: i, distance: distance});
          }
          else{
            let temp = distanceSort.pop();
            distanceSort.push({index: i, distance: distance});
            distanceSort.push(temp);
          }
        }
      }
      first = distanceSort.pop();
      second = distanceSort.pop();
      for(let i = 0; i < distanceSort.length; i++){
        if(distanceSort[i].distance < second.distance){
          second = distanceSort[i];
        }
      }
      first = weathers[first.index].data[0];
      second = weathers[second.index].data[0];
      
      if(first.dust !== null && second.dust)
        dust = (first.dust * (1 / (first.distance + 1)) + second.dust * (1 / (second.distance + 1))) / (1 / (first.distance + 1) + 1 / (second.distance + 1));
      else
        dust = null;
      result = {
        temperature: (first.temperature * (1 / (first.distance + 1)) + second.temperature * (1 / (second.distance + 1))) / (1 / (first.distance + 1) + 1 / (second.distance + 1)),
        humidity: (first.humidity * (1 / (first.distance + 1)) + second.humidity * (1 / (second.distance + 1))) / (1 / (first.distance + 1) + 1 / (second.distance + 1)),
        rain: (first.rain * (1 / (first.distance + 1)) + second.rain * (1 / (second.distance + 1))) / (1 / (first.distance + 1) + 1 / (second.distance + 1)),
        dust: dust
      }
      res.json(result);
    });
  }
  else{
    next();
  }
});

module.exports = router;
