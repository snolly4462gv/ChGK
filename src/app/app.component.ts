import { Component, OnInit } from '@angular/core';
import { UserModel } from "../app/core/user.model";
import { MainService } from "../app/core/main.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  isNewGame:boolean = true;
  Players:UserModel[] = [];
  QuestCount:number = 12;
  TeamsCount:number = 0;
  GameMatrix:Array<number>; 
  Result:string="";
  QFlag:boolean = false;
  QString:string = "";
  QCurr:number = 0;

  constructor(private service:MainService){}

  ngOnInit(){
    this.GetPlayers();
    this.GameMatrix = this.NewMatrixArray(this.TeamsCount,this.QuestCount,0);
  }

  NewMatrixArray(rows,columns,val){
    var arr = new Array();
    for(var i=0; i<rows; i++){
      arr[i] = new Array();
      for(var j=0; j<columns; j++){
        arr[i][j] = val;
      }
    }
    return arr;
  }
  
  CreateGame() {
    this.BuildTable();
    this.isNewGame = false;
  }

  GetPlayers(){
    this.Players = this.service.GetPlayers();
    this.TeamsCount = this.Players.length;
  }

  BuildTable(){
    var x = document.createElement("TABLE");
    x.setAttribute("id", "myTable");
    document.getElementById("START_PAGE").appendChild(x);

    var y = document.createElement("TR");
    y.setAttribute("id", "myTr");
    document.getElementById("myTable").appendChild(y);

    var z = document.createElement("TD");
    var t = document.createTextNode("ID");
    z.appendChild(t);
    document.getElementById("myTr").appendChild(z);

    var z = document.createElement("TD");
    var t = document.createTextNode("Название");
    z.appendChild(t);
    document.getElementById("myTr").appendChild(z);

    var z = document.createElement("TD");
    var t = document.createTextNode("Категория");
    z.appendChild(t);
    document.getElementById("myTr").appendChild(z);

    var z = document.createElement("TD");
    var t = document.createTextNode("Зачет");
    z.appendChild(t);
    document.getElementById("myTr").appendChild(z);

    for(let i=1;i<=this.QuestCount;i++){
      var z = document.createElement("TD");
      var t = document.createTextNode(i+"");
      z.appendChild(t);
      z.setAttribute("id","cell_num_q_"+i);
      z.onclick = ()=>{
        this.QAnswer(i);
      };
      document.getElementById("myTr").appendChild(z);
    }

    let count = 1;
    for(let player of this.Players){

      var y = document.createElement("TR");
      y.setAttribute("id", "myTr"+count);
      document.getElementById("myTable").appendChild(y);
      
      var z = document.createElement("TD");
      var t = document.createTextNode(player.id+"");
      z.appendChild(t);
      document.getElementById("myTr"+count).appendChild(z);

      var z = document.createElement("TD");
      var t = document.createTextNode(player.first_name+"");
      z.setAttribute("id", "pl_name_"+count);
      z.appendChild(t);
      document.getElementById("myTr"+count).appendChild(z);

      var z = document.createElement("TD");
      var t = document.createTextNode(player.category+"");
      z.setAttribute("id", "pl_cat_"+count);
      z.appendChild(t);
      document.getElementById("myTr"+count).appendChild(z);

      var z = document.createElement("TD");
      var t = document.createTextNode(player.in_game+"");
      z.setAttribute("id", "pl_ingame_"+count);
      z.appendChild(t);
      document.getElementById("myTr"+count).appendChild(z);

      //ответная таблица
      for(let i=1;i<=this.QuestCount;i++){
        var z = document.createElement("TD");
        z.setAttribute("id","cell_"+count+"_"+i);
        var t = document.createTextNode("");
        z.appendChild(t);
        z.onclick = ()=>{
          this.tableClick(player.id,i);
        };
        document.getElementById("myTr"+count).appendChild(z);
      }
      count++;
    }
}

QAnswer(i:number){
  if(this.QFlag)
    document.getElementById("cell_num_q_"+i).style.backgroundColor="white";
  else 
  document.getElementById("cell_num_q_"+i).style.backgroundColor="red";
  this.QFlag = !this.QFlag;
  this.QString = "";
  this.QCurr = i;
}

QAnswerApl(){
  this.QString = this.QString.trim();
  let answers:string[] = this.QString.split(" ");
  for (let i=0;i<answers.length;i++){
    if(+answers[i]-1<this.GameMatrix.length){
      let player = +answers[i];
    this.GameMatrix[player-1][this.QCurr-1] = 1;
    document.getElementById("cell_"+player+"_"+this.QCurr).style.backgroundColor="green";
    }
  }
  console.log(this.GameMatrix);
  this.QAnswer(this.QCurr);
  this.GetResult();
}

QAllAdd(){
  for(let i=0;i<this.TeamsCount;i++){
    let player = i+1;
    this.GameMatrix[i][this.QCurr-1] = 1;
    document.getElementById("cell_"+player+"_"+this.QCurr).style.backgroundColor="green";
  }
  this.QAnswer(this.QCurr);
  this.GetResult();
}

QAllDel(){
  for(let i=0;i<this.TeamsCount;i++){
    let player = i+1;
    this.GameMatrix[i][this.QCurr-1] = 0;
    document.getElementById("cell_"+player+"_"+this.QCurr).style.backgroundColor="white";
  }
  this.QAnswer(this.QCurr);
  this.GetResult();
}
 


tableClick(player,question) {
    if (this.GameMatrix[player-1][question-1] == 0){ this.GameMatrix[player-1][question-1] = 1;
      document.getElementById("cell_"+player+"_"+question).style.backgroundColor="green";
    }
    else { 
      this.GameMatrix[player-1][question-1] = 0;
      document.getElementById("cell_"+player+"_"+question).style.backgroundColor="white";
    }
    this.GetResult();
  }


GetResult(){
  this.Result = "ok "+this.GameMatrix[0]+"   ("+this.SumArray(this.GameMatrix,0)+") ";

}  

SumArray(arr:Array<number>,n){
  let sum = 0;
  for(let i=0;i<this.QuestCount;i++)
    sum+=arr[n][i];
  return sum;
}

}
