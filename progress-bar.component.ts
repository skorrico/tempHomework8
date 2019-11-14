import { Component, OnInit } from '@angular/core';
import { IpapiService } from '../ipapi.service';


@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  progressBar = false;

  constructor( private service:IpapiService) {
    this.service.progressBar.subscribe(data =>{
      console.log('progress bar is on from emitter' + data);
      this.progressBar = true;
    });
    this.service.darkSkyEmitter.subscribe(data =>{
      console.log("Progress Bar: dark sky got data");
      this.progressBar = false;
    });
    this.service.isClear.subscribe(data => {
      console.log("pogressBar listens and clears");
      this.progressBar = false;
      
    });
    this.service.favDarkSkyEmitter.subscribe(data =>{
      console.log("Progress Bar: dark sky got data");
      this.progressBar = false;
    })
   }

  ngOnInit() {
  }

}
