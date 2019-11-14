import { Component, OnInit } from '@angular/core';
import { IpapiService } from '../ipapi.service';
import { SearchForm } from "./search-form";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  name = 'searchForm'; 
  form = SearchForm;
  searchForm: FormGroup;
  gotLocation: boolean = false;
  location: Object;
  checkbox = null;
  searchCheckBox = false;
  autoCompleteSub: Subscription;
  autoCompleteOptions = [];
  test = ['help', "please", "hopefully", "hope", "place"];

  constructor(private apiService: IpapiService, private formbuilder: FormBuilder, private router:Router ){
    this.searchForm = new FormGroup({
      'cityName': new FormControl(),
    });
  }

  clear() {
      console.log("in clear");
      this.searchCheckBox = false;
      this.checkbox = null;
      this.searchForm.reset();
      this.apiService.clear();
      this.searchForm.controls['location'].setValue(true);
      console.log("after clear location: " + this.searchForm.controls['location'].value);
    }

    search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(20),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.autoCompleteOptions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 5))
    )

    disable(){
      console.log("disaled() value of check: " + this.searchForm.controls['location'].value);
      if(this.searchForm.controls['location'].value == false || this.searchForm.controls['location'].value == null){
        console.log("checkbox is checked");
        //checked
        this.checkbox = true;
        this.searchCheckBox = true;
        this.getLatLon();
      }
      else{
        console.log("disable() value of check: "+this.searchForm.controls['location'].value);
        console.log("checkbox is not checked");
        this.checkbox = null;
        this.searchCheckBox = false;
      }
      // console.log(this.form.location);
    }

    getLatLon(){
        this.apiService.getLocation().subscribe(data => {
          console.log(data['city']);
          this.location = {
            lat: data["latitude"],
            lng: data["longitude"],
            state: data['region'],
            city: data['city']
          };
          // console.log("city: checkbox " + this.location['city']);
          this.searchForm.controls['lat'].setValue(this.location['lat']);
          this.searchForm.controls['lon'].setValue(this.location['lng']);
          // this.searchForm.controls['state'].setValue(this.location['state']);
          this.searchForm.controls['cityHidden'].setValue(this.location['city']);
          this.searchForm.controls['stateHidden'].setValue(this.location['state']);
          // console.log(this.searchForm.value.lat);
          // console.log(this.searchForm.value.lon);
          // console.log(this.searchForm.value.state);
          // console.log("state hidden: "+this.searchForm.value.stateHidden);
          this.form.testBool = true;
        });
      }
    
  ngOnInit() {
    console.log("checkbox: " + this.checkbox);
    this.searchForm = this.formbuilder.group({
      streetName: ['',  Validators.required],
      cityName: ['', Validators.required],
      state: ['', Validators.required],
      location: [false],
      lat: [''],
      lon: [''],
      cityHidden: [''],
      stateHidden: ['']
    });
    this.onChanges();
  }

  onChanges(){
    console.log('onChanges called');
    //call autoComplete API every 500ms
    this.autoCompleteOptions = [];
    this.searchForm.get('cityName').valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.apiService.getAutoComplete(value).subscribe(data =>{
        if(value != '' && data['status'] != "ZERO_RESULTS" && data['status'] != 'INVALID_REQUEST'){
          for(var i = 0; i < data['predictions'].length; i++){
            this.autoCompleteOptions[i] = data['predictions'][i]['structured_formatting']['main_text'];
          }
        }
      })
    });
    
  }

  getAutoComplete(e){
      console.log("autoComplete");
      //need to call API in app.js
  }

  onSubmit(){
    const holder = {'streetName':this.searchForm.value.streetName,
                    'cityName':this.searchForm.value.cityName,
                    'state':this.searchForm.value.state,
                    'location':this.searchForm.value.location,
                    'lat':this.searchForm.value.lat,
                    'lon':this.searchForm.value.lon,
                    'cityHidden':this.searchForm.value.cityHidden,
                    'stateHidden':this.searchForm.value.stateHidden
                  };
      console.log("in on submit");
      if(this.searchForm.controls['location'].value == true){ //actually means true
          console.log("current location used");
          // console.log("onsubmit: " + this.searchForm.value.lat);
          // console.log("onsubmit: " + this.searchForm.value.lon);
      }
      else{
        console.log(this.searchForm.controls['location'].value);
          console.log("form filled out");
      }
      let navigate: NavigationExtras={
        queryParams:{
          'input': JSON.stringify(holder)
        }
      };
      // console.log("json query: "+JSON.stringify(holder));
      this.router.navigate(['tab'],navigate);

      //notifying progress bar component and tabs component a new search has been made
      this.apiService.showProgresssBar(true);
  }


  states = ["Select State",
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "District Of Columbia",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming"        
    ];


}
