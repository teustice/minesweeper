import { Component, OnInit } from '@angular/core';
import { Space } from './space.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  colors: string[] = ['red','orange','green','blue','pink','salmon','darkgray','black'];
  board = [];
  difficultySettings = [
    {
      name: 'beginner',
      x: 8,
      y: 8,
      bombs: 10
    },
    {
      name: 'intermediate',
      x: 16,
      y: 16,
      bombs: 40
    },
    {
      name: 'expert',
      x: 32,
      y: 16,
      bombs: 99
    }
  ]
  difficultyRating: number;
  currentDifficulty;
  initialClick: boolean = true;
  didYouWin;
  gameClock: number = 0;
  clockInterval;

  ngOnInit(){
    this.genBoard(0);
  }

  onChange(optionFromMenu) {
    this.didYouWin = ''
    this.genBoard(parseInt(optionFromMenu,10));
    this.initialClick = true;
    clearInterval(this.clockInterval);
    this.gameClock = 0;
  }

  genBoard(difficulty: number) {
    this.board.length = 0;
    this.difficultyRating = difficulty;
    this.currentDifficulty = this.difficultySettings[this.difficultyRating];
    for(let x = 0; x < this.currentDifficulty.x; x++){
      this.board.push([]);
    }

    for(let x = 0; x < this.currentDifficulty.x; x++){
      for(let y = 0; y < this.currentDifficulty.y; y++){
        this.board[x].push(new Space(x,y));
      }
    }
    this.logBoard();
  }

  genBombs(){
    let bombCount = this.currentDifficulty.bombs
    let xMax = this.currentDifficulty.x;
    let yMax = this.currentDifficulty.y;
    for(let bombs = 0; bombs < bombCount; bombs++){
      let x:number, y:number;
      do {
        x = Math.floor(Math.random() * xMax);
        y = Math.floor(Math.random() * yMax);
      } while(this.board[x][y].isBomb);
      this.board[x][y].isBomb = true;
    }

    // this.logBoard();
    this.countBombs();
  }

  countBombs() {
    for(let x = 0; x < this.board.length; x++){
      for(let y = 0; y < this.board[0].length; y++){
        if(!this.board[x][y].isBomb){

          if(x-1 >= 0 && y-1 >= 0 && this.board[x-1][y-1].isBomb) this.board[x][y].bombCount += 1;
          if(x-1 >= 0 && this.board[x-1][y].isBomb) this.board[x][y].bombCount += 1;
          if(x-1 >= 0 && y+1 < this.board[0].length && this.board[x-1][y+1].isBomb) this.board[x][y].bombCount += 1;

          if(y-1 >= 0 && this.board[x][y-1].isBomb) this.board[x][y].bombCount += 1;
          if(y+1 < this.board[0].length && this.board[x][y+1].isBomb) this.board[x][y].bombCount += 1;

          if(x+1 < this.board.length && y-1 >= 0 && this.board[x+1][y-1].isBomb) this.board[x][y].bombCount += 1;
          if(x+1 < this.board.length && this.board[x+1][y].isBomb) this.board[x][y].bombCount += 1;
          if(x+1 < this.board.length && y+1 < this.board[0].length && this.board[x+1][y+1].isBomb) this.board[x][y].bombCount += 1;
        } else {
          this.board[x][y].bombCount = 9;
        }
      }
    }
    this.logBoard();
  }

  logBoard(){
    let line = '';
    for(let x = 0; x < this.board.length; x++){
      for(let y = 0; y < this.board[0].length; y++){
        if(this.board[x][y].isBomb){
          line = line.concat('B  ');
        } else {
          line = line.concat(`${this.board[x][y].bombCount}  `);
        }
      }
      line = '';
    }
  }


  updateBoard(space: Space){
    // this.initialize(space);
    if(this.initialClick) {
      do {
        this.genBoard(this.difficultyRating);
        this.genBombs();
      } while(this.board[space.x][space.y].bombCount !== 0 || this.board[space.x][space.y].isBomb)
      this.gameTimer();
      this.initialClick = false;
    }
    if(this.board[space.x][space.y].clickedStatus !== 'flagged'){
      if(space.isBomb){
        console.log("KABLOOOM, game over")
        this.gameOver();
      } else{
        this.reveal(space.x,space.y)
        space.isClicked = true;
        this.victory();
      }
    }
  }

  gameTimer() {
      this.clockInterval = setInterval(() => this.gameClock += 1, 1000);
  }

  gameOver(){
    for(let x = 0; x < this.board.length; x++){
      for(let y = 0; y < this.board[0].length; y++){
        this.board[x][y].isClicked = true;
        this.board[x][y].clickedStatus = 'revealed';
      }
    }
    clearInterval(this.clockInterval);
    this.didYouWin = 'GAME OVER'
  }

  victory(){
    let totalClicked = 0;
    for(let x = 0; x < this.board.length; x++){
      for(let y = 0; y < this.board[0].length; y++){
        if(this.board[x][y].isClicked === true){
          totalClicked += 1;
        }
      }
    }

    if(totalClicked === ((this.currentDifficulty.x * this.currentDifficulty.y) - this.currentDifficulty.bombs)){
      clearInterval(this.clockInterval);
      this.didYouWin = 'Victory is yours!'
    }
  }

  reveal(x: number, y: number){
    if(x >= 0 && x < this.board.length && y >= 0 && y < this.board[0].length && !this.board[x][y].isClicked && !this.board[x][y].isBomb && this.board[x][y].clickedStatus !== 'flagged'){
      this.board[x][y].isClicked = true;
      this.board[x][y].clickedStatus = 'revealed';
      if(this.board[x][y].bombCount === 0){
        this.reveal(x-1,y-1);
        this.reveal(x-1,y);
        this.reveal(x-1,y+1);

        this.reveal(x,y-1);
        this.reveal(x,y+1);

        this.reveal(x+1,y-1);
        this.reveal(x+1,y);
        this.reveal(x+1,y+1);
      }
    }
  }

  getColor(index: string){
    return this.colors[parseInt(index,10)];
  }

  flagThat(space: Space) {
    if(this.board[space.x][space.y].clickedStatus === 'flagged'){
      this.board[space.x][space.y].clickedStatus = 'hidden';
    }
    else if(this.board[space.x][space.y].clickedStatus === 'hidden'){
      this.board[space.x][space.y].clickedStatus = 'flagged';
    }
  }
}
