var cityChosen = $('#city-name');
var searchButton = $('#button');

var curentWetherSection = $(".current-weather")

var cityTitle = $('<h1>');

var futureDates = $('.future-days');

var futureWeather = $('.futureweather');

var searchedItems = $('.searched-cities')

var temp = $('<p>');
var wind = $('<p>');
var humidity = $('<p>');
var uvi = $('<p>');
var iconOfWether = $('<img>');

var citiesSearched = [];

var search = $('.sidenav-container');

var infoOfCities = {};

const apiKey = "69e7f271225797eab3845354a33b9f9d";

var queryURL;
var otherURL;

var today = moment();

var newCityname = "";

var cityinsearchhistory = false;

// localStorage.clear();
var originalCitychosen = false;

function futureweather(data){
    console.log(data);
    futureDates.empty();

    for(var i=1;i<6;i++){

        var info = $('<div>');
        var futuretemp = $('<span>');
        var futureWind = $('<span>');
        var futureHumidity = $('<span>');
        var futureicon = $('<img>')

        var index = i-1;
        console.log( "index " + index.toString());
        futuretemp.text("Temp: " + data["daily"][index]["temp"]["day"]);
        futureWind.text("Wind: " + data["daily"][index]["wind_speed"]);
        futureHumidity.text("Humudity " + data["daily"][index]["humidity"]);
        futureicon.attr('src', 'https://openweathermap.org/img/w/' + data["daily"][index]["weather"]["0"]["icon"] + '.png')

        var new_date = moment().add(i, 'days');
        var advancdedFate = new_date.toString().substring(4,15);
        info.addClass('formatColumns');
        info.append(advancdedFate);
        info.append(futureicon);
        info.append(futuretemp);
        info.append(futureWind);
        info.append(futureHumidity);
        
        

        futureDates.append(info);

        console.log("future-days " + futureDates);

        futureWeather.append(futureDates);




        console.log( "thissss " + advancdedFate);
    }
    
}


function something(data){
    console.log(data);
    var currentDate = today.format("MMM Do, YYYY");
    if(cityinsearchhistory){
        cityTitle.text(newCityname + " (" + currentDate + ")");
        cityinsearchhistory = false;
    }
    else{
        cityTitle.text(cityChosen.val() + " (" + currentDate + ")");
    }
    curentWetherSection.append(cityTitle);

   
    iconOfWether.attr('src', 'https://openweathermap.org/img/w/' + data["current"]["weather"]["0"]["icon"] + '.png');
    curentWetherSection.append(iconOfWether);

    temp.text("Temp: " + data["current"]["temp"] + " deg");
    curentWetherSection.append(temp);

    wind.text("Wind: " + data["current"]["wind_speed"]);
    curentWetherSection.append(wind);

    humidity.text("Humidity " + data["current"]["humidity"] + " %");
    curentWetherSection.append(humidity);

    uvi.text("UV index: " + data["current"]["uvi"]);
    curentWetherSection.append(uvi);

    
    
    

    
}

searchButton.on('click', function(){
    DisplayCities(cityChosen.val());
    console.log("this " + cityChosen.val());
    queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityChosen.val() + "&units=imperial&appid=" + apiKey;
    FindData();
   
    
})


function FindData(){
    
    

    fetch(queryURL)
        .then(function(response){
            return response.json();
        })

        .then(function(data){
            otherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data["coord"]["lat"] + "&units=imperial&lon=" + data["coord"]["lon"] + "&appid=" +  apiKey;
            fetch(otherURL)
                .then(function(response){
                    return response.json();
                })
                .then(function(data1){
                    something(data1)
                    futureweather(data1);
                    console.log(data1);
                })
    
        
        
        })

}

function DisplayCities(city){
    citiesSearched.push(city);

    var placeForCity = $('<h3>');
    placeForCity.text(city);
    placeForCity.css('background-color', 'gray');
    searchedItems.append(placeForCity);

    placeForCity.on('click',function(){
        cityinsearchhistory = true;
        console.log($(this).text());
        newCityname = $(this).text();
        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $(this).text() + "&units=metric&appid=" + apiKey;
        FindData();
    })
  
    

    

    if(localStorage.getItem('items') == null){
        localStorage.setItem('items', JSON.stringify(citiesSearched));
    }
    else{
        citiesSearched = JSON.parse(localStorage.getItem('items'));
        citiesSearched.push(city)
        localStorage.setItem('items',JSON.stringify(citiesSearched));
    }


}

$(document).ready(function(){
    
    if(localStorage.getItem('items') !==null){
        var items = JSON.parse(localStorage.getItem('items'));
        for(var i=0;i<items.length;i++){
            var placeForCity = $('<h3>');
            placeForCity.text(items[i]);
            placeForCity.css('background-color', 'gray');
            searchedItems.append(placeForCity);
        }
    }

    $(".searched-cities h3").on("click", function(){
        newCityname = $(this).text();
        cityinsearchhistory = true;
        queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + $(this).text() + "&units=metric&appid=" + apiKey;
        FindData();
    })

})

