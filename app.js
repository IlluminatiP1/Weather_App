const express = require("express");
const app = express();
const https = require("https");
const ejs = require("ejs");
const api=require(__dirname+"/api.js");
const bodyParser=require("body-parser");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
      res.sendFile(__dirname+"/index.html");
})
app.get("*",function(req,res){
  res.render("error");
})
app.post("/",function(req,res){
        const query=req.body.cityName;
      if(query=="")
      {
        res.render("error");
      }
      else{
        const apikey=api.getApi();
        const units="metric"
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apikey+"&units="+units;
        https.get(url,function(response){
        if(response.statusCode!=200)
        {
          res.render("error");
        }
        else
        {
          response.on("data",function(data){
          const weatherData = JSON.parse(data);
          const temp = weatherData.main.temp
          const weatherDescription = (weatherData.weather[0].description).toUpperCase();
          const icon = weatherData.weather[0].icon;
          const feellike=weatherData.main.feels_like;
          const tmin=weatherData.main.temp_min;
          const tmax=weatherData.main.temp_max;
          const humidity=weatherData.main.humidity;
          const name=weatherData.name;
          const main=weatherData.weather[0].main;
          const pressure=weatherData.main.pressure;
          const windspeed=weatherData.wind.speed;
          const imageURL = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
          res.render("post",{name:name,windspeed:windspeed,humidity:humidity,pressure:pressure,feellike:feellike,main:main,weatherDescription:weatherDescription,tmax:tmax,tmin:tmin,temp:temp,imageURL:imageURL});
        })
        }

    })
      }

})
app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000. ");
})
