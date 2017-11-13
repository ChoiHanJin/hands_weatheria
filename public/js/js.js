var map;
var markers = [];
var icons = {
    sun: {
        1: '/images/sun-01.png',
        2: '/images/sun-02.png',
        3: '/images/sun-03.png',
        4: '/images/sun-04.png',
        5: '/images/sun-05.png',
        6: '/images/sun-06.png',
        7: '/images/sun-07.png',
        8: '/images/sun-08.png',
        9: '/images/sun-09.png',
        10: '/images/sun-10.png',
        11: '/images/sun-11.png',
        12: '/images/sun-12.png',
        13: '/images/sun-13.png',
        14: '/images/sun-14.png',
        15: '/images/sun-15.png',
        16: '/images/sun-16.png',
        17: '/images/sun-17.png',
        18: '/images/sun-18.png',
        19: '/images/sun-19.png',
        20: '/images/sun-20.png',
        21: '/images/sun-21.png',
        22: '/images/sun-22.png',
        23: '/images/sun-23.png',
        24: '/images/sun-24.png',
        25: '/images/sun-25.png',
        26: '/images/sun-26.png',
        27: '/images/sun-27.png',
        28: '/images/sun-28.png',
        29: '/images/sun-29.png',
        30: '/images/sun-30.png',
        31: '/images/sun-31.png',
        32: '/images/sun-32.png',
        33: '/images/sun-33.png',
        34: '/images/sun-34.png',
        35: '/images/sun-35.png'
    },
    cloud: {
        1: '/images/cloud-01.png',
        2: '/images/cloud-02.png',
        3: '/images/cloud-03.png',
        4: '/images/cloud-04.png',
        5: '/images/cloud-05.png',
        6: '/images/cloud-06.png',
        7: '/images/cloud-07.png',
        8: '/images/cloud-08.png',
        9: '/images/cloud-09.png',
        10: '/images/cloud-10.png',
        11: '/images/cloud-11.png',
        12: '/images/cloud-12.png',
        13: '/images/cloud-13.png',
        14: '/images/cloud-14.png',
        15: '/images/cloud-15.png',
        16: '/images/cloud-16.png',
        17: '/images/cloud-17.png',
        18: '/images/cloud-18.png',
        19: '/images/cloud-19.png',
        20: '/images/cloud-20.png',
        21: '/images/cloud-21.png',
        22: '/images/cloud-22.png',
        23: '/images/cloud-23.png',
        24: '/images/cloud-24.png',
        25: '/images/cloud-25.png',
        26: '/images/cloud-26.png',
        27: '/images/cloud-27.png',
        28: '/images/cloud-28.png',
        29: '/images/cloud-29.png',
        30: '/images/cloud-30.png',
        31: '/images/cloud-31.png',
        32: '/images/cloud-32.png',
        33: '/images/cloud-33.png',
        34: '/images/cloud-34.png',
        35: '/images/cloud-35.png'
    },
    rainyDay: {
        1: '/images/rain-01.png',
        2: '/images/rain-02.png',
        3: '/images/rain-03.png',
        4: '/images/rain-04.png',
        5: '/images/rain-05.png',
        6: '/images/rain-06.png',
        7: '/images/rain-07.png',
        8: '/images/rain-08.png',
        9: '/images/rain-09.png',
        10: '/images/rain-10.png',
        11: '/images/rain-11.png',
        12: '/images/rain-12.png',
        13: '/images/rain-13.png',
        14: '/images/rain-14.png',
        15: '/images/rain-15.png',
        16: '/images/rain-16.png',
        17: '/images/rain-17.png',
        18: '/images/rain-18.png',
        19: '/images/rain-19.png',
        20: '/images/rain-20.png',
        21: '/images/rain-21.png',
        22: '/images/rain-22.png',
        23: '/images/rain-23.png',
        24: '/images/rain-24.png',
        25: '/images/rain-25.png',
        26: '/images/rain-26.png',
        27: '/images/rain-27.png',
        28: '/images/rain-28.png',
        29: '/images/rain-29.png',
        30: '/images/rain-30.png',
        31: '/images/rain-31.png',
        32: '/images/rain-32.png',
        33: '/images/rain-33.png',
        34: '/images/rain-34.png',
        35: '/images/rain-35.png'
    },
    car: '/images/car.png'
};
var zoomSize = 17;
const iamhere = {lat: 37.514973, lng: 127.027578};
var iconSize = 70;
const rainThreshold = 400;
const cloudThreshold = 600;
var ajaxURL = (latInit && lngInit) ? "/data?lat=" + latInit + "&lng=" + lngInit
                                     : "/data";
                                     
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
}

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}
function initMap() {
    let lat = latInit;
    let lng = lngInit;
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoomSize,
        center: iamhere
    });
    
    if(lat !== 0 && lng !== 0){
        var marker = new google.maps.Marker({
            position: {lat: lat, lng: lng},
            icon: {
                url: icons.car,
                scaledSize: new google.maps.Size(iconSize/2, iconSize/4)
            },
            map: map
        });
    }

    for(var i = 0; i < weathers.length; i++){
        if(weathers[i] !== null){
            var data = weathers[i];
            var temperatureInt = Math.floor(data.temperature);
            var dustInt = Math.floor(data.dust);
            var humidityInt = Math.floor(data.humidity);
            var raindrop = (data.rain < rainThreshold) ? Math.floor((800 - data.rain) / 10) : 0;
            var position = data.position;
    
            if(data.rain < rainThreshold) data.rain = 'rainyDay';
            else if(data.rain < cloudThreshold) data.rain = 'cloud';
            else data.rain = 'sun';
            
            var contentString = 
                '<div class="weather-info">'+
                '<div class="weather-info-left">'+
                '<div class="weather-info-gps">'+
                '<img src="/images/infoWindow/weatherinfo-dot.png">'+
                '<span class="middle"><span class="weather-info-gps-lat">' + data.position.lat.toFixed(4) + '</span>,&nbsp;<span class="weather-info-gps-lng">'+data.position.lng.toFixed(4) + '</span></span>'+
                '</div>'+
                '<img src="/images/infoWindow/weatherinfo-'+data.rain+'.png" class="weather-info-img">'+
                '</div>'+
                '<div class="weather-info-right">'+
                '<ul class="weather-info-specific">'+
                '<li class="weather-info-list">'+
                '<img src="/images/infoWindow/weatherinfo-temperature.png" class="weather-info-icon">'+
                '<div>'+
                '<img src="/images/infoWindow/weatherinfo-temperature-unit.png" class="weather-info-unit">'+
                '<span>'+temperatureInt+'</span>'+
                '</div>'+
                '</li>'+
                '<li class="weather-info-list">'+
                '<img src="/images/infoWindow/weatherinfo-raindrop.png" class="weather-info-icon">'+
                '<div>'+
                '<img src="/images/infoWindow/weatherinfo-raindrop-unit.png" class="weather-info-unit">'+
                '<span>'+raindrop+'</span>'+
                '</div>'+
                '</li>'+
                '<li class="weather-info-list">'+
                '<img src="/images/infoWindow/weatherinfo-dust.png" class="weather-info-icon">'+
                '<div>'+
                '<img src="/images/infoWindow/weatherinfo-dust-unit.png" class="weather-info-unit">'+
                '<span>'+dustInt+'</span>'+
                '</div>'+
                '</li>'+
                '<li class="weather-info-list">'+
                '<img src="/images/infoWindow/weatherinfo-humidity.png" class="weather-info-icon">'+
                '<div>'+
                '<img src="/images/infoWindow/weatherinfo-humidity-unit.png" class="weather-info-unit">'+
                '<span>'+humidityInt+'</span>'+
                '</div>'+
                '</li>'+
                '</ul>'+
                '</div>'+
                '</div>';
            
            var marker = new google.maps.Marker({
                position: position,
                icon: {
                    url: icons[data.rain][temperatureInt],
                    scaledSize: new google.maps.Size(iconSize, iconSize)
                },
                map: map
            });
            
            markers.push(marker);
            
            var infowindow = new google.maps.InfoWindow();
                
            google.maps.event.addListener(marker,'click', (function(marker, contentString){ 
                return function() {
                    infowindow.setContent(contentString);
                    infowindow.open(map, marker);
                };
            })(marker, contentString));
        }
    }
    if(lat !== 0 && lng !== 0){
        google.maps.event.addListener(map, 'idle', function(){
            var position = map.getCenter();
            var zoom = map.getZoom();
            var lat = position.lat();
            var lng = position.lng();
            ajaxURL = "/data?lat=" + lat + "&lng=" + lng + "&z=" + zoom;        
            refreshMap(ajaxURL);
        });
    }
}
    
// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

  // Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function refreshMap(URL) {
    $.get( URL, function( weathers ) {
        weathers.clean(null);
        
        for(var i = 0; i < markers.length; i++){
            google.maps.event.clearListeners(markers[i], 'click');
        }
        
        if(markers.length === weathers.length){
            for(var i = 0; i < weathers.length; i++){
                var data = weathers[i];
                if(data !== null){
                    var temperatureInt = Math.floor(data.temperature);
                    var dustInt = Math.floor(data.dust);
                    var humidityInt = Math.floor(data.humidity);
                    var raindrop = (data.rain < rainThreshold) ? Math.floor((800 - data.rain) / 10) : 0;
                    var position = data.position;
            
                    if(data.rain < rainThreshold) data.rain = 'rainyDay';
                    else if(data.rain < cloudThreshold) data.rain = 'cloud';
                    else data.rain = 'sun';
                    
                    var contentString =
                        '<div class="weather-info">'+
                        '<div class="weather-info-left">'+
                        '<div class="weather-info-gps">'+
                        '<img src="/images/infoWindow/weatherinfo-dot.png">'+
                        '<span class="middle"><span class="weather-info-gps-lat">'+data.position.lat.toFixed(4) + '</span>,&nbsp;<span class="weather-info-gps-lng">'+data.position.lng.toFixed(4) + '</span></span>'+
                        '</div>'+
                        '<img src="/images/infoWindow/weatherinfo-'+data.rain+'.png" class="weather-info-img">'+
                        '</div>'+
                        '<div class="weather-info-right">'+
                        '<ul class="weather-info-specific">'+
                        '<li class="weather-info-list">'+
                        '<img src="/images/infoWindow/weatherinfo-temperature.png" class="weather-info-icon">'+
                        '<div>'+
                        '<img src="/images/infoWindow/weatherinfo-temperature-unit.png" class="weather-info-unit">'+
                        '<span>'+temperatureInt+'</span>'+
                        '</div>'+
                        '</li>'+
                        '<li class="weather-info-list">'+
                        '<img src="/images/infoWindow/weatherinfo-raindrop.png" class="weather-info-icon">'+
                        '<div>'+
                        '<img src="/images/infoWindow/weatherinfo-raindrop-unit.png" class="weather-info-unit">'+
                        '<span>'+raindrop+'</span>'+
                        '</div>'+
                        '</li>'+
                        '<li class="weather-info-list">'+
                        '<img src="/images/infoWindow/weatherinfo-dust.png" class="weather-info-icon">'+
                        '<div>'+
                        '<img src="/images/infoWindow/weatherinfo-dust-unit.png" class="weather-info-unit">'+
                        '<span>'+dustInt+'</span>'+
                        '</div>'+
                        '</li>'+
                        '<li class="weather-info-list">'+
                        '<img src="/images/infoWindow/weatherinfo-humidity.png" class="weather-info-icon">'+
                        '<div>'+
                        '<img src="/images/infoWindow/weatherinfo-humidity-unit.png" class="weather-info-unit">'+
                        '<span>'+humidityInt+'</span>'+
                        '</div>'+
                        '</li>'+
                        '</ul>'+
                        '</div>'+
                        '</div>';
                    markers[i].setPosition(position);
                    markers[i].setIcon({
                            url: icons[data.rain][temperatureInt],
                            scaledSize: new google.maps.Size(iconSize, iconSize)
                    });
                    
                    var marker = new google.maps.Marker();
                    marker = markers[i];
                
                    var infowindow = new google.maps.InfoWindow();
                        
                    google.maps.event.addListener(marker,'click', (function(marker, contentString){ 
                        return function() {
                            infowindow.setContent(contentString);
                            infowindow.open(map, marker);
                        };
                    })(marker, contentString));
                    console.log(data);
                }
            }
        }
        else{
            deleteMarkers();
            for(var i = 0; i < weathers.length; i++){
                var data = weathers[i];
                if(data !== null){
                    var temperatureInt = Math.floor(data.temperature);
                    var position = data.position;
            
                    if(data.rain < rainThreshold) data.rain = 'rainyDay';
                    else if(data.rain < cloudThreshold) data.rain = 'cloud';
                    else data.rain = 'sun';
                    
                    var marker = new google.maps.Marker({
                        position: position,
                        icon: {
                            url: icons[data.rain][temperatureInt],
                            scaledSize: new google.maps.Size(iconSize, iconSize)
                        },
                        map: map
                    });
                    
                    var infowindow = new google.maps.InfoWindow();
                        
                    google.maps.event.addListener(marker,'click', (function(marker,contentString,infowindow){ 
                        return function() {
                            infowindow.setContent(contentString);
                            infowindow.open(map,marker);
                        };
                    })(marker,contentString,infowindow));
                    
                    markers.push(marker);
                }
            }
        }
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
    setInterval(function(){
        refreshMap(ajaxURL);
    }, 5000);
});