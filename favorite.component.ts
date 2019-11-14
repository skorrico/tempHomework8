import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { IpapiService } from '../ipapi.service';
import { FavoriteServiceService } from '../favorite-service.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  @ViewChild('resultsEl', {static: false}) resultsClass: ElementRef;
  @ViewChild('favEl', {static: false}) favClass: ElementRef;
  favorites= false;
  error= false;
  showTable = false;
  favoritesData = ''; totalRows = []; totalColumns = [1,2,3,4];

  constructor(private service:IpapiService, private fav:FavoriteServiceService, private renderer: Renderer2) {
    this.fav.favoriteEmitter.subscribe(data =>{
      if(parseInt(localStorage.getItem('count'))!=0){
        console.log(localStorage.getItem('count'));
        this.favorites = true;
      }
      else{
        this.favorites = false;
      }
    });
    this.service.isClear.subscribe(data => {
      console.log("consumer listens and clears");
      this.favorites = false;
      this.error = false;
      this.showTable = false
      // document.getElementById("fav").classList.remove("active");
      // document.getElementById("results").className += " active";
      this.renderer.addClass(this.resultsClass.nativeElement, 'active');
      this.renderer.removeClass(this.favClass.nativeElement, "active");
      
    });
    this.service.darkSkyEmitter.subscribe(data =>{
      //need to hide favorites table after search executed & returned data
      this.showTable = false;
    });
    this.service.favDarkSkyEmitter.subscribe(data=> {
      this.showResults();
    });
    
   }

   show(){
    this.renderer.addClass(this.favClass.nativeElement, 'active');
    this.renderer.removeClass(this.resultsClass.nativeElement, "active");
     if(parseInt(localStorage.getItem('count'))==0){
       console.log("do not show");
       this.fav.hideResults(true);
       this.error = true;
     }
     if(parseInt(localStorage.getItem('count')) > 0){
       console.log("we have a favorites added");
      //  console.log("local storage: " + localStorage.getItem('holder'));
       this.parseFavorites();
       this.fav.hideResults(true);
       this.favorites = true;
       this.showTable = true;
      //  let btn = document.getElementsByClassName("active");
       
     }
   }

   showResults(){
    this.fav.showResult(true);
    this.showTable = false;
    this.error = false;
    this.renderer.addClass(this.resultsClass.nativeElement, 'active');
    this.renderer.removeClass(this.favClass.nativeElement, "active");
    
  }

  parseFavorites(){
    let x = JSON.parse(localStorage.getItem('holder'));
    if(localStorage.getItem('count')=='1'){
      console.log("one favorite");
      let length = (x.length/4);
      this.favoritesData = x;
      console.log(this.favoritesData);
      for(var i = 0; i < length; i++){
        this.totalRows[i] = i;
      }
    }
    else{
      this.favoritesData = x;
      console.log(this.favoritesData);
    }
    // console.log(this.totalRows);
    // console.log("size of cols: " + this.totalColumns.length);
    // console.log(this.favoritesData);
  }

  deleteFavorite(index){
    console.log("deleting favorite " + index + " on favorites tab")

    console.log(typeof(this.favoritesData));
    let keys = Object.keys(this.favoritesData);
    console.log("keys: " + keys + " deleting on index: " + index);
    delete this.favoritesData[keys[index]];
    // delete this.favoritesData[0].children;
    // console.log(JSON.stringify(this.favoritesData));
    // var holder = [];
    // var i = 0;
    // for(let key in keys){
    //   console.log("key value: " + key);
    //   if(key != index){
    //     console.log(JSON.stringify(this.favoritesData[keys[key]]));
    //     // this.favoritesData = this.favoritesData[keys[key]];
    //     holder[i] = this.favoritesData[keys[key]];
    //     console.log("new holder: " + holder[key]);
    //     this.favoritesData = JSON.stringify(this.favoritesData[keys[key]]);
    //     i += 1;
    //   }
    // }

    //updating count in local storage
    let count = parseInt(localStorage.getItem('count'));
    count -= 1;
    localStorage.setItem('count', count.toString());
    console.log('count after decrease (favs component)');

    //conditions for num favorite
    if(count == 0){
      this.error = true;
      this.showTable = false;
      this.favorites = false;
      localStorage.setItem('holder', '');
      this.fav.deleteFavorite(true);
    }
    else{
      //update localStorage - continue to show table
      var holder = [];
      var i = 0;
      for(let key in keys){
        console.log("key value: " + key + " index delete value: " + index);
        if(parseInt(key) != parseInt(index)){
          console.log(JSON.stringify(this.favoritesData[key]));
          // this.favoritesData = this.favoritesData[keys[key]];
          holder[i] = this.favoritesData[keys[key]];
          console.log("new holder: " + holder[key]);
          // this.favoritesData = JSON.stringify(this.favoritesData[keys[key]]);
          i += 1;
        }else{
          continue;
        }
      }
      // console.log(this.favoritesData);
      console.log('holder: ' + JSON.stringify(holder));
      localStorage.setItem('holder', JSON.stringify(holder));
      this.favoritesData = JSON.parse(localStorage.getItem('holder'));
      console.log(this.favoritesData);
      this.fav.deleteFavorite(true);
    }

  }

  favCitySearch(cityIndex){
    this.service.showProgresssBar(true);
    this.showTable = false;
    console.log("new search within favorites tag for city: " + cityIndex);
    console.log(this.favoritesData[cityIndex]); 
    localStorage.setItem('favCity', this.favoritesData[cityIndex]['city']);
    localStorage.setItem('favState', this.favoritesData[cityIndex]['state']);
    this.service.getGoogleAPI('', this.favoritesData[cityIndex]['city'], this.favoritesData[cityIndex]['state']).subscribe(data =>{
      // console.log(JSON.stringify(data));
      if(data['status'] == "OK"){
        let lat = data['results'][0]['geometry']['location']['lat'];
        let lon = data['results'][0]['geometry']['location']['lng'];
        console.log('lat: ' + lat + " lon: " + lon);
        // this.service.getDarkSkyAPI(lat, lon);
        this.service.getDarkSkyAPIFav(lat,lon);
      }
      else{
        
        this.error = true;
      }
    });
  }

  ngOnInit() {
  }

}
