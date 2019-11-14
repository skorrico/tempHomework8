import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteServiceService {
  @Output() favoriteEmitter: EventEmitter<any> = new EventEmitter();
  @Output() resultEmitter: EventEmitter<any> = new EventEmitter();
  @Output() resultShowEmitter: EventEmitter<any> = new EventEmitter();
  @Output() deleteFavEmitter: EventEmitter<any> = new EventEmitter();

  constructor() { }

  addNewFavorite(x){
    this.favoriteEmitter.emit(x);
  }
  hideResults(x){
    this.resultEmitter.emit(x);
  }
  showResult(x){
    this.resultShowEmitter.emit(x);
  }

  deleteFavorite(x){
    this.deleteFavEmitter.emit(x); //emit that a city was deleted
  }

}
