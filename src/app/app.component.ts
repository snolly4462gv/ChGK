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
  RaundCount:number = 3;
  TeamsCount:number = 0;
  GameMatrix:Array<number>; 
  GameRating:number[] = [];
  GameInGameRating:number[] = [];
  Result:string="";
  QFlag:boolean = false;
  QString:string = "";
  QCurr:number = 0;

  constructor(private service:MainService){}

  ngOnInit(){
    this.GetPlayers();
    this.GameMatrix = this.NewMatrixArray(this.TeamsCount,this.QuestCount*this.RaundCount,0);
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

    for(let i=1;i<=this.QuestCount*this.RaundCount+3;i++){
      var z = document.createElement("TD");
      if(i%(this.QuestCount+1)!=0){
        let q = i - Math.floor(i/(this.QuestCount+1));
        z.setAttribute("id","cell_num_q_"+q);
      z.onclick = ()=>{
      this.QAnswer(i);
      };}

      if(i%(this.QuestCount+1)==0)
        var t = document.createTextNode("");
      else 
        var t = document.createTextNode(i%(this.QuestCount+1)+"");
        z.appendChild(t);
       
        
      document.getElementById("myTr").appendChild(z);
    }

    let count = 1;

    for(let player of this.Players){

      var y = document.createElement("TR");
      y.setAttribute("id", "myTr"+count);
      document.getElementById("myTable").appendChild(y);
      
      var z = document.createElement("TD");
      var t = document.createTextNode(player.id+"");
      z.setAttribute("id", "pl_id_"+count);
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
      for(let i=1;i<=this.QuestCount*this.RaundCount+3;i++){
        var z = document.createElement("TD");
        
        if(i%(this.QuestCount+1)==0){
          z.setAttribute("id","cell_res_"+count+"_"+Math.floor(i/this.QuestCount));
          z.style.backgroundColor = "cornflowerblue";
          z.style.color = "white";
        }
        else 
        {
        let q= i -Math.floor(i/(this.QuestCount+1));
          z.setAttribute("id","cell_"+count+"_"+q);
        }

      //  var t = document.createTextNode(z.id);
       var t = document.createTextNode("");
        z.appendChild(t);
        if(i%(this.QuestCount+1)!=0)
        z.onclick = ()=>{
          this.tableClick(player.id,i);
        };
        document.getElementById("myTr"+count).appendChild(z);
      }
      count++;
    }
}

QAnswer(i:number){
 
  let q = i - Math.floor(i/(this.QuestCount+1));
  console.log(i,q);
  if(this.QFlag&&q==this.QCurr||!this.QFlag){
  if(this.QFlag)
    document.getElementById("cell_num_q_"+q).style.backgroundColor="white";
  else 
  document.getElementById("cell_num_q_"+q).style.backgroundColor="red";
  this.QFlag = !this.QFlag;
  this.QString = "";
  this.QCurr = q;
}
}

QAnswerApl(){
  this.QString = this.QString.trim();
  let answers:string[] = this.QString.split(" ");
  for (let i=0;i<answers.length;i++){
    if(+answers[i]-1<this.GameMatrix.length){
      let player = +answers[i];
    this.GameMatrix[player-1][this.QCurr-1] = 1;
    document.getElementById("cell_"+player+"_"+this.QCurr).style.backgroundColor="#4CAF50";
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
    document.getElementById("cell_"+player+"_"+this.QCurr).style.backgroundColor="#4CAF50";
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
  let q = question-Math.floor(question/(this.QuestCount+1));
  console.log(q);
    if (this.GameMatrix[player-1][q-1] == 0){ this.GameMatrix[player-1][q-1] = 1;
      document.getElementById("cell_"+player+"_"+q).style.backgroundColor="#4CAF50";
    }
    else { 
      this.GameMatrix[player-1][q-1] = 0;
      document.getElementById("cell_"+player+"_"+q).style.backgroundColor="white";
    }
    this.GetResult();
  }


GetResult(){
  console.log(this.GameMatrix);
  //this.Result = "ok "+this.GameMatrix[0]+"   ("+this.SumArray(this.GameMatrix,0)+") ";
  
  for (let j=1;j<=this.RaundCount;j++)
  for(let i=1;i<=this.TeamsCount;i++){
    
    document.getElementById("cell_res_"+i+"_"+j).removeChild( document.getElementById("cell_res_"+i+"_"+j).lastChild);
    var cell = document.getElementById("pl_id_"+i).textContent+"."+this.SumArray(this.GameMatrix,i-1,j-1);
    if(j>1)cell+=":"+this.SumArrayAll(this.GameMatrix,i-1,j);
    var t = document.createTextNode(cell+"");
    document.getElementById("cell_res_"+i+"_"+j).appendChild(t);

  }

  this.GetAllGameRating();
  this.GetInGameRating();

  this.Result = "";
  for(let i=0;i<this.TeamsCount;i++){
    let u=i+1;
    var id = document.getElementById("pl_id_"+u).textContent;
    var ratingInGame = this.GameInGameRating[i]+"";
      if(!ratingInGame||ratingInGame=="undefined") ratingInGame = "";
    this.Result += id+") Score:"+ " Rating: "+this.GameRating[i]+" "+ratingInGame+" || ";
  }

}

GetAllGameRating(){
  this.GameRating = [];
  for(let i=0;i<this.TeamsCount;i++)this.GameRating.push(0);
  for(let i=0;i<this.QuestCount*this.RaundCount;i++){
    let rtq = 0;
    for(let j=0;j<this.GameMatrix.length;j++){
      rtq+=this.GameMatrix[j][i];
    }
    rtq = this.TeamsCount -rtq + 1;
    for(let j=0;j<this.GameMatrix.length;j++){
     if(this.GameMatrix[j][i]==1)this.GameRating[j]+=rtq;
    }
  }
  console.log(this.GameRating);
 // this.Result = "  ||  "+ this.GameRating+"";
}

GetInGameRating(){
  this.GameInGameRating = [];

  for(let i=1;i<=this.TeamsCount;i++)
    if(document.getElementById("pl_ingame_"+i).textContent=="Да")
      this.GameInGameRating.push(0);

  for(let i=0;i<this.QuestCount*this.RaundCount;i++){
    let rtq = 0;
    for(let j=0;j<this.GameMatrix.length;j++){
      let u = j+1;
      if(document.getElementById("pl_ingame_"+u).textContent=="Да")
      rtq+=this.GameMatrix[j][i];
    }
    rtq = this.GameInGameRating.length -rtq + 1;
    for(let j=0;j<this.GameMatrix.length;j++){
      let u = j+1;
      if(document.getElementById("pl_ingame_"+u).textContent=="Да")
     if(this.GameMatrix[j][i]==1)this.GameInGameRating[j]+=rtq;
    }
  }
 // this.Result += "  |  "+this.GameInGameRating+"";
  
}

SumArray(arr:Array<number>,n,m){
  let sum = 0;
  for(let i=0;i<this.QuestCount;i++)
  {
    sum+=arr[n][i+m*this.QuestCount];
  }
  return sum;
}
SumArrayAll(arr:Array<number>,n,m){
  let sum = 0;
  for(let i=0;i<this.QuestCount*m;i++)
  {
    sum+=arr[n][i];
  }
  return sum;
}

}
