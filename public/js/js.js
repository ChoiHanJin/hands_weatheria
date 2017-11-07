$(document).ready(function(){
    setInterval(function(){
        $.get( "/data", function( weathers ) {
            if(markers.length === weathers.length){
                for(var i = 0; i < weathers.length; i++){
                    var data = weathers[i].data[0];
                    var position = data.position;
            
                    if(data.rain > 300) data.rain = 'rainyDay';
                    else data.rain = 'sun';
                    
                    markers[i].setPosition(position);
                    markers[i].setIcon(
                        icons[data.rain].icon
                    );
                }
            }
            else{
                deleteMarkers();
                for(var i = 0; i < weathers.length; i++){
                    var data = weathers[i].data[0];
                    var position = data.position;
            
                    if(data.rain > 300) data.rain = 'rainyDay';
                    else data.rain = 'sun';
                    
                    var marker = new google.maps.Marker({
                        position: position,
                        icon: icons[data.rain].icon,
                        map: map
                    });
                    markers.push(marker);
                }
            }
        });
    }, 5000)
});