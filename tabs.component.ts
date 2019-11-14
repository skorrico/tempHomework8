import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { IpapiService } from '../ipapi.service';
import { Chart } from 'chart.js';
import * as CanvasJS from '../canvasjs.min';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { FavoriteServiceService } from '../favorite-service.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {
  @ViewChild('barchart', {static: false}) private chartRef;
  @ViewChild('rangechart', {static: false}) private rangeRef;
  @ViewChild('modal', {static: false}) modalButton: ElementRef;
  lat = ''; lon = '';
  currently = ''; //currently JSON var
  currentlyOzone = 0; currentlyHumidity = 0; currentlyVisibility = 0; currentlyPressure = 0;
  currentlyCloud = 0; currentlyWind = 0;
  hourly = ''; //hourly JSON var
  weekly = ''; //weeklly JSON var
  weeklyTemps = []; //2D array 
  sealURL = '';
  city = ''; state = '';timezone ='';
  hourlyTemp = []; hourlyWind = []; hourlyPressure = []; 
  hourlyOzone = []; hourlyHumidity = []; hourlyVisibility = [];
  chart: any; rangeChart: any;
  selectedOption: string;
  hourlySelect=['temperature', 'pressure', 'humidity', 'ozone', 'visibility', 'windSpeed'];
  showAlert = false; error = false; showResults = false; favoritesButton = false;
  weeklyChartBool = false; progresBar = false;
  modalOptions:NgbModalOptions; x = 'test'; currentlyDetail = []; currentlyTime: any; 
  favoriteCheck=false; iconURL = '';
  windSpeed= ''; currentlyDetailTemperature = 0; currentlyDetailSumm = ''; currentlyDetailPrecipIntensity = 0;
  currentlyDetailPrecipProb = 0; currentlyDetailWind = 0; currentlyDetailHumidity = 0;
  currentlyDetailVisibility = 0; currentlySumm = ''; currentlyTemp = 0;
  lowHigh = []; day = []; unixTime = [];
  
  constructor(private router:Router, private route:ActivatedRoute, private service:IpapiService, private fav: FavoriteServiceService,
    private modalService: NgbModal) {
    
      this.selectedOption = this.hourlySelect[0];

    this.service.isClear.subscribe(data => {
      console.log("consumer listens and clears");
      this.showResults = false;
      this.error = false;
      this.showAlert = false;

      //clear function 
      this.clear();
    });

    this.service.progressBar.subscribe(data =>{
      console.log('search button has been hit ' + data);
      this.showResults = false;
    });

    this.service.weeklyEmitter.subscribe(data =>{
      console.log("subscribed: done");
      // this.mod.open("myModal");
      console.log(data);
      this.currentlyDetail = data['currently'];
      let v = new Date (this.currentlyDetail['time']*1000);
      console.log(this.currentlyDetail['time']);
      this.currentlyTime = v.getUTCDate() + '/' + (v.getMonth()+1) + '/' + v.getFullYear();
      this.currentlyDetailTemperature = Math.round(this.currentlyDetail['temperature']);
      this.currentlyDetailSumm = this.currentlyDetail['summary'];
      this.currentlyDetailPrecipIntensity = Math.round(this.currentlyDetail['precipIntensity'] * 100)/ 100;
      this.currentlyDetailPrecipProb = this.currentlyDetail['precipProbability'] * 100; 
      this.currentlyDetailWind = Math.round(this.currentlyDetail['windSpeed'] * 100)/ 100;
      this.currentlyDetailHumidity = Math.round(this.currentlyDetail['humidity'] * 100); 
      this.currentlyDetailVisibility = Math.round(this.currentlyDetail['visibility'] * 100)/ 100;
      console.log(this.currentlyDetail['icon']);
      if(this.currentlyDetail['icon'] == 'clear-day' || 'clear-night'){
        this.iconURL = this.icons[0];
      }
      else if(this.currentlyDetail['icon'] == 'rain'){ this.iconURL = this.icons[1];}
      else if(this.currentlyDetail['icon'] == 'snow'){ this.iconURL = this.icons[2];}
      else if(this.currentlyDetail['icon'] == 'sleet'){ this.iconURL = this.icons[3];}
      else if(this.currentlyDetail['icon'] == 'wind'){ this.iconURL = this.icons[4];}
      else if(this.currentlyDetail['icon'] == 'fog'){ this.iconURL = this.icons[5];}
      else if(this.currentlyDetail['icon'] == 'cloudy'){ this.iconURL = this.icons[6];}
      else if(this.currentlyDetail['icon'] == 'partly-cloudy-day' || this.currentlyDetail['icon'] == 'partly-cloudy-night'){ 
        this.iconURL = this.icons[7];}
      
      //button.click()
      // document.getElementById('modalButton').click();
      let event: Event = new Event('click');
      console.log(this.modalButton);
      this.modalButton.nativeElement.dispatchEvent(event);
    });
    this.fav.deleteFavEmitter.subscribe(data =>{
      console.log("tab heard - favorite deleted");
      if(parseInt(localStorage.getItem('count')) !=0){
        let x = JSON.parse(localStorage.getItem('holder'));
        for(var i = 0; i < x.length; i++){
          if(this.city == x[i].city){
            this.favoriteCheck = true;
          }
          else{
            this.favoriteCheck = false;
          }
        }
      }
      //no favorites in list
      else{ 
        this.favoriteCheck = false;
      }
      
    });
    this.service.favDarkSkyEmitter.subscribe(data=> {
      console.log("******************dark sky fav got data*******************");
      // console.log(JSON.stringify(data));
      if(parseInt(localStorage.getItem('count')) != 0){
        this.city = localStorage.getItem('favCity');
        this.state = localStorage.getItem('favState');
        console.log("favorite city: " + this.city + " favorite state: " + this.state);
        let x = JSON.parse(localStorage.getItem('holder'));
        for(var i = 0; i < x.length; i++){
          console.log("current fav city: " + x[i].city + " current fav state " + x[i].state);
          if(this.city == x[i].city && this.state == x[i].state){
            console.log("already in favorites");
            this.favoriteCheck = true;
          }
          // else{
          //   console.log("not a favorite");
          //   this.favoriteCheck = false;
          // }
        }
      }
      else{
        this.favoriteCheck = false;
      }

      this.currently = data['currently'];
      this.currentlySumm = this.currently['summary']; this.currentlyTemp = Math.round(this.currently['temperature']);
      this.currentlyCloud = this.currently['cloudCover']; this.currentlyOzone = this.currently['ozone'];
      this.currentlyPressure = this.currently['pressure']; this.currentlyHumidity = this.currently['humidity'];
      this.currentlyWind = this.currently['windSpeed']; this.currentlyVisibility = this.currently['visibility'];
      this.timezone = data['timezone'];
      // console.log(this.currently);
      this.hourly = data['hourly'];
      this.weekly = data['daily']['data'];
      // console.log("weekly data: " + this.weekly[0]['temperatureLow']);
      // console.log("hourly data: "+this.hourly['data'][0]['temperature']);
      this.showResults = true;
      this.sealIcon(this.state);
    });
    this.service.darkSkyEmitter.subscribe(data =>{
      console.log("******************dark sky got data*******************");
      // console.log(JSON.stringify(data));
      if(parseInt(localStorage.getItem('count')) != 0){
        let x = JSON.parse(localStorage.getItem('holder'));
        for(var i = 0; i < x.length; i++){
          if(this.city == x[i].city && this.state == x[i].state){
            console.log("already in favorites");
            this.favoriteCheck = true;
          }
          else{
            console.log("not a favorite");
            this.favoriteCheck = false;
          }
        }
      }
      else{
        this.favoriteCheck = false;
      }

      this.currently = data['currently'];
      this.currentlySumm = this.currently['summary']; this.currentlyTemp = Math.round(this.currently['temperature']);
      this.currentlyCloud = this.currently['cloudCover']; this.currentlyOzone = this.currently['ozone'];
      this.currentlyPressure = this.currently['pressure']; this.currentlyHumidity = this.currently['humidity'];
      this.currentlyWind = this.currently['windSpeed']; this.currentlyVisibility = this.currently['visibility'];
      this.timezone = data['timezone'];
      // console.log(this.currently);
      this.hourly = data['hourly'];
      this.weekly = data['daily']['data'];
      // console.log("weekly data: " + this.weekly[0]['temperatureLow']);
      // console.log("hourly data: "+this.hourly['data'][0]['temperature']);
      this.showResults = true;
      this.sealIcon(this.state);
    });
    this.fav.resultEmitter.subscribe(data =>{
      console.log("tabs component heard and is hiding");
      this.showResults = false;
    });
    this.fav.resultShowEmitter.subscribe(data =>{
      if(this.showResults == false && this.city == "" && this.sealURL == ""){
        this.showResults = false;
      }
      else{
        console.log("tabs heard and is showing");
        this.showResults = true;
        console.log(this.hourlyTemp);
        // this.sealIcon(this.state);
      }
      
    })
   }

  //new chart arrays
  public labels = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','19','20','20','21','22','23'];

  createChart(){
    let dataSet = [];
    let yAxesLabel = '';
    let maxValue = 0; let minValue = 0;
    let step = 2;
    if(this.selectedOption == "temperature"){dataSet=this.hourlyTemp; yAxesLabel='Farenheit'; minValue = this.minValue(this.hourlyTemp); maxValue = this.maxValue(this.hourlyTemp); maxValue+=2;}
    else if(this.selectedOption == "pressure"){dataSet=this.hourlyPressure; yAxesLabel='Millibars'; minValue = this.minValue(this.hourlyPressure); maxValue = this.maxValue(this.hourlyPressure); maxValue+=2;}
    else if(this.selectedOption == "humidity"){dataSet=this.hourlyHumidity; yAxesLabel='% Humidity'; minValue = this.minValue(this.hourlyHumidity); maxValue = this.maxValue(this.hourlyHumidity); maxValue+=5; step =5;}
    else if(this.selectedOption == "ozone"){dataSet=this.hourlyOzone; yAxesLabel='DobSon Units'; minValue = this.minValue(this.hourlyOzone); maxValue = this.maxValue(this.hourlyOzone); maxValue+=5; step = 5;}
    else if(this.selectedOption == "windSpeed"){dataSet=this.hourlyWind; yAxesLabel='Miles per Hour'; maxValue = this.maxValue(this.hourlyWind); maxValue+=2; step = 1;}
    else if(this.selectedOption == "visibility"){dataSet=this.hourlyVisibility; yAxesLabel='Miles (Maximum 10)'; maxValue = 12; step = 1;}
    if(this.chart){ 
      this.chart.destroy();
    }
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels, // your labels array
        datasets: [
          {
            fill: true,
            backgroundColor: "rgba(165,208,238,1)",
            data: dataSet, // your data array
            label: this.selectedOption
          }
        ]
      },
      options: {
        legend: {
          display: true,
          onClick: function (e) {
            e.stopPropagation();
          }
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time Different From Current Hour'
            }
            
          }],
          yAxes: [{
            ticks: {
              suggestedMax: maxValue,
              suggestedMin: minValue,
              stepSize: step
          },
            scaleLabel: {
              display: true,
              labelString: yAxesLabel
            }
            
          }],
        }
      }
    });

  }

  chartCreation(){
    let maxValue = this.maxValue(this.hourlyTemp); maxValue += 2;
    let minValue = this.minValue(this.hourlyTemp); 
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.labels, // your labels array
        datasets: [
          {
            fill: true,
            backgroundColor: "rgba(165,208,238,1)",
            data: this.hourlyTemp, // your data array
            label: "temperature"
          }
        ]
      },
      options: {
        legend: {
          display: true,
          onClick: function (e) {
            e.stopPropagation();
          }
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Time Different From Current Hour'
            }
            
          }],
          yAxes: [{
            ticks: {
            suggestedMax: maxValue,
            suggestedMin: minValue,
            stepSize: 2
        },
            scaleLabel: {
              display: true,
              labelString: 'Farenheit'
            }
            
          }],
        }
      }
    });
  }

  rangeCreation(lowHigh,day,unixTime,lat,lon,api){		
    console.log("on range create lat & lon: " + lat + ", " + lon);
		this.rangeChart = new CanvasJS.Chart("chartContainer",{
      animationEnabled: true,
      title: {
        text: "Weekly Weather"
      },
      legend: {
        verticalAlign: 'top',
        horizontalAlight: 'center'
      },
      dataPointMaxWidth: 15,
      axisX: {
        title: "Days",
        gridThickness: 0
      },
      axisY: {
        includeZero: false,
        title: "Temperature in Farenheit",
        interval: 10,
        gridThickness: 0,
      }, 
      data: [{
        type: "rangeBar",
        color: "lightBlue",
        click: this.modal,
        legendText: "Day wise temperature range",
        showInLegend: true,
        yValueFormatString: "#0.#",
        indexLabel: "{y[#index]}",
        toolTipContent: "<b>{label}</b>: {y[0]} to {y[1]}",
        dataPoints: [
          { x: 10, y:lowHigh[7], label: day[7], date: unixTime[7], lat: lat, lon: lon, api: api},
          { x: 20, y:lowHigh[6], label: day[6], date: unixTime[6], lat: lat, lon: lon, api: api},
          { x: 30, y:lowHigh[5], label: day[5], date: unixTime[5], lat: lat, lon: lon, api: api },
          { x: 40, y:lowHigh[4], label: day[4], date: unixTime[4], lat: lat, lon: lon, api: api },
          { x: 50, y:lowHigh[3], label: day[3], date: unixTime[3], lat: lat, lon: lon, api: api },
          { x: 60, y:lowHigh[2], label: day[2], date: unixTime[2], lat: lat, lon: lon, api: api },
          { x: 70, y:lowHigh[1], label: day[1], date: unixTime[1], lat: lat, lon: lon, api: api },
          { x: 80, y:lowHigh[0], label: day[0], date: unixTime[0], lat: lat, lon: lon, api: api }
        ]
      }]
      
    });
    this.rangeChart.render();
    
  }  

  modal(e){
    console.log(e.dataPoint.date);  
    e.dataPoint.api.getWeeklyDetails(e.dataPoint.lat, e.dataPoint.lon, e.dataPoint.date);  
  }

  parse(queryResult){
    // console.log(queryResult['location']);
    if(queryResult['location'] == false || queryResult['location'] == null){
      console.log('check query same search: ' +queryResult['streetName'])
      console.log("call googleapi");
      let street = queryResult['streetName'];
      this.city = queryResult['cityName'];
      this.state = queryResult['state'];
      this.service.getGoogleAPI(street, this.city, this.state).subscribe(data =>{
        console.log("checking for time out " + data['status']);
        if(data['status'] == "OK"){
          this.lat = data['results'][0]['geometry']['location']['lat'];
          this.lon = data['results'][0]['geometry']['location']['lng'];
          this.darkSky(this.lat, this.lon, this.state);
        }
        else{
          this.showAlert = true;
          this.error = true;
        }
      });
    }
    else{
      this.lat = queryResult['lat'];
      this.lon = queryResult['lon'];
      this.state = queryResult['stateHidden'];
      this.city = queryResult['cityHidden'];
      // console.log(this.city);
      // console.log(this.lat);
      // console.log(this.lon);
      this.darkSky(this.lat, this.lon, this.state);
    }
    
  }

  darkSky(lat, lon, state){
    this.service.getDarkSkyAPI(this.lat, this.lon);
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sealIcon(state){
    this.service.getSeal(state).subscribe(data =>{
      console.log("seal: "+ data['items'][0]['link']);
      this.sealURL = data['items'][0]['link'];
      if(this.showResults == true){
        console.log("show results true");
        this.hourlyData();
        this.weeklyData();
      }
    })
  }

  hourlyData(){
    for(var i = 0; i < 24; i++){
      this.hourlyTemp[i] = Math.round(this.hourly['data'][i]['temperature']);
      this.hourlyHumidity[i] = this.hourly['data'][i]['humidity']*100;
      this.hourlyOzone[i] = this.hourly['data'][i]['ozone'];
      this.hourlyVisibility[i] = this.hourly['data'][i]['visibility'];
      this.hourlyWind[i] = this.hourly['data'][i]['windSpeed'];
      this.hourlyPressure[i] = this.hourly['data'][i]['pressure'];
    }
    this.chartCreation();
  }
  weeklyData(){
    //7 days of low,high pairs 
    // let lowHigh = [];
    // let day = [];
    // let unixTime = [];
    for(var i = 0; i < 8; i++){
      this.unixTime[i] = this.weekly[i]['time'];
      this.lowHigh[i] = [Math.round(this.weekly[i]['temperatureLow']),Math.round(this.weekly[i]['temperatureHigh'])];
      let v = new Date(this.unixTime[i]*1000);
      let ex = v.getUTCDate() + '/' + (v.getMonth()+1) + '/' + v.getFullYear();
      this.day[i] = ex;
    }
    // this.rangeCreation(this.lowHigh,this.day,this.unixTime,this.lat,this.lon,this.service);
    
    
  }

  weeklyTab(){
    // console.log("weekly tab click");
    // if(document.getElementById("chartContainer")){
      // console.log("div there");
      this.sleep(300).then(()=>{
          this.rangeCreation(this.lowHigh,this.day,this.unixTime,this.lat,this.lon,this.service);
    });
      
      // this.rangeChart.render();
    // }
  }

  ngOnInit() {
    // console.log("**********************onit called**********************");
    this.route.queryParams.subscribe(a=>{
      if(Object.keys(a).length != 0){
        const queryResult = JSON.parse(a['input']);
        this.parse(queryResult);
      }
    });
    localStorage.setItem("count", '0');
    localStorage.setItem("holder", '');
  }

  twitter(){
    let city = this.city;
    let summary = this.currently['summary'];
    let temp = this.currently['temperature'];
    let url = "https://twitter.com/intent/tweet?text=The current temperature at " + city + " is " + temp + String.fromCharCode(176) +
    "F. The weather conditions are " + summary + ". &hashtags=CSCI571WeatherSearch";
    window.open(url, "_blank");
  }
  open(content){
    let closeResult = '';
    this.modalService.open(content).result.then((result) => {
      closeResult = `Closed with: ${result}`;
    });
  }

  deleteFavorite(){
    console.log("delete favorite");

    //toggle star icon
    this.favoriteCheck = false;

    //delete from localStorage
    if(parseInt(localStorage.getItem('count')) == 1){
      console.log("only one favorite deleting holder");
      localStorage.setItem('count', '0');
      localStorage.removeItem('holder');
      console.log("new count " + parseInt(localStorage.getItem('count')));
    }
    //more than 1 favorite case
    else{
      let holder = JSON.parse(localStorage.getItem('holder'));
      let temp = [];
      let keys = Object.keys(holder);
      var i = 0;
      for(let key in keys){
        console.log(key);
        console.log(holder[key]['city']);
        
        //conditional if two favorites have the same city
        if(this.city == holder[key]['city'] && this.state != holder[key]['state']){
        temp[i] = holder[keys[key]];
        console.log("new holder: " + temp[key]);
        i += 1;
        }
        //conditional if favorites do not have the same city
        else if(this.city != holder[key]['city']){
          temp[i] = holder[keys[key]];
          console.log("new holder: " + temp[key]);
          i += 1;
        }
      }
      localStorage.setItem('holder', JSON.stringify(temp));
      let count = parseInt(localStorage.getItem('count'));
      count -= 1;
      localStorage.setItem('count', count.toString());
    }
    this.fav.addNewFavorite(true);
    
    
  }
  

  favorite(){
    this.favoriteCheck = true;
    console.log("store data in localStorage");
    let count = parseInt(localStorage.getItem('count'));
    var temp = [];
    if(count == 0){
      count += 1;
      console.log("number of favorites: " + count);
      let obj : any = 
      {
        'count': count,
        'url' : this.sealURL,
        'city' : this.city,
        'state': this.state
      }
      // let stor = [count, this.sealURL, this.city, this.state];
      temp.push(obj);
      localStorage.setItem('holder', JSON.stringify(temp));
    }
    else{
      let x = localStorage.getItem("holder");
      temp = JSON.parse(x);
      count += 1;
      console.log("number of favorites: " + count);
      // let stor = [count, this.sealURL, this.city, this.state];
      let stor : any = 
      {
        'count': count,
        'url' : this.sealURL,
        'city' : this.city,
        'state': this.state
      }
      temp.push(stor);
      localStorage.setItem('holder', JSON.stringify(temp));
      console.log('local storage update: ' + JSON.parse(localStorage.getItem('holder')));
    }
    localStorage.setItem('count', JSON.stringify(count));
    // console.log(JSON.stringify(temp));
    this.fav.addNewFavorite(true);
  }

  icons = ['https://cdn3.iconfinder.com/data/icons/weather-344/142/sun-512.png',
  'https://cdn3.iconfinder.com/data/icons/weather-344/142/rain-512.png',
  'https://cdn3.iconfinder.com/data/icons/weather-344/142/snow-512.png',
  'https://cdn3.iconfinder.com/data/icons/weather-344/142/lightning-512.png',
  'https://cdn4.iconfinder.com/data/icons/the-weather-is-nice-today/64/weather_10-512.png',
  'https://cdn3.iconfinder.com/data/icons/weather-344/142/cloudy-512.png',
  'https://cdn3.iconfinder.com/data/icons/weather-344/142/sunny-512.png'];

  clear(){
    this.sealURL = ''; 
      this.city = ''; this.state = '';this.timezone ='';
      this.hourlyTemp = []; this.hourlyWind = []; this.hourlyPressure = []; 
      this.hourlyOzone = []; this.hourlyHumidity = []; this.hourlyVisibility = [];
      this.chart.destroy(); this.selectedOption = "temperature";
      this.showResults = false;

  }

  maxValue(array){
    let max = array[0];
    for(var i = 1; i < array.length; i++){
      if(max < array[i]){
        max = array[i];
      }
    }
    return max;
  }
  minValue(array){
    let min = array[0];
    for(var i = 1; i < array.length; i++){
      if(min > array[i]){
        min = array[i];
      }
    }
    min -= 1;
    return min;
  }

}
