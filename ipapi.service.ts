import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpapiService {
  @Output() weeklyEmitter: EventEmitter<any> = new EventEmitter();
  @Output() darkSkyEmitter: EventEmitter<any> = new EventEmitter();
  @Output() progressBar: EventEmitter<any> = new EventEmitter();
  @Output() favDarkSkyEmitter: EventEmitter<any> = new EventEmitter();

  private _isClear = new Subject();
  isClear = this._isClear.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  // private url:string = 'http://ip-api.com/json';
    private url: string = 'https://ipapi.co/json/?';
    
  private googleAPI:string ='https://bananza8.appspot.com/form_api?/';

  showProgresssBar(x){
    console.log('telling progress bar to turn on');
    this.progressBar.emit(x);
  }

  getGoogleAPI(street, city, state){
    let newURL = this.googleAPI+ 'street=' + street + '&city=' + city + '&state=' + state;
    console.log(newURL);
    return this.http.get(newURL);
  }

  getDarkSkyAPI(lat, lon){
    let newURL = 'https://bananza8.appspot.com/work_pls?lat=' + lat + '&lon=' + lon;
    console.log(newURL);
    this.http.get(newURL).subscribe(data =>{
      this.darkSkyEmitter.emit(data);
    })
    // return this.http.get(newURL);
  }

  getDarkSkyAPIFav(lat,lon){
    let newURL = 'https://bananza8.appspot.com/work_pls?lat=' + lat + '&lon=' + lon;
    console.log(newURL);
    this.http.get(newURL).subscribe(data =>{
      this.favDarkSkyEmitter.emit(data);
    })
  }

  getSeal(state){
    let newURL = 'https://bananza8.appspot.com/seal_icon?state=' + state;
    console.log(newURL);
    return this.http.get(newURL);
  }

  getLocation() {
    return this.http.get(this.url);
  }

  getAutoComplete(token){
    let newURL = 'https://bananza8.appspot.com/auto_complete?token=' + token;
    return this.http.get(newURL);
  }

  getWeeklyDetails(lat,lon,time){
    let newURL = 'https://bananza8.appspot.com/detail?lat=' + lat + '&lon='+ lon + '&time=' + time;
    console.log("lat: " + lat + "lon: " + lon + "time: " + time);
    this.http.get(newURL).subscribe(data =>{
      this.weeklyEmitter.emit(data);
    });
  }
  

  clear(){
    console.log("service clear");
    this._isClear.next(true);
  }
}
