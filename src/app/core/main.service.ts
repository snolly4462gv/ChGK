import { Injectable } from "@angular/core";
import { Http, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/Rx';
import {Subject} from 'rxjs/Subject';
import { UserModel } from "./user.model";


@Injectable()
export class MainService{
    
    private Players:UserModel[] = [];

    constructor(){
     this.setPlayers();
    }

    public GetPlayers(){
        return this.Players;
    }

    public setPlayers(){
      this.Players = 
      [
        {
          "id": 1,
          "first_name": "One",
          "category": "Младшая",
          "in_game":"Да"
        },
        {
          "id": 2,
          "first_name": "Two",
          "category": "Старшая",
          "in_game":"Да"
        },
        {
          "id": 3,
          "first_name": "Three",
          "category": "Старшая",
          "in_game":"Нет"
        }
      ]
    }

}