import { Component } from '@angular/core';
import { Space } from './space.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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


  genBoard(difficulty: string) {
    this.difficultyRating = parseInt(difficulty,10);
    this.currentDifficulty = this.difficultySettings[this.difficultyRating];
    for(let x = 0; x < this.currentDifficulty.x; x++){
      this.board.push([]);
    }

    for(let x = 0; x < this.currentDifficulty.x; x++){
      for(let y = 0; y < this.currentDifficulty.y; y++){
        this.board[x].push(new Space(x,y));
      }
    }
    this.genBombs();
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
        console.log(`\ttry @ (${x},${y})`);
      } while(this.board[x][y].isBomb);
      console.log(`plant @ (${x},${y})`)
      this.board[x][y].isBomb = true;
    }
    this.countBombs();
  }

  countBombs() {
    for(let x = 0; x < this.board.length; x++){
      for(let y = 0; y < this.board[0].length; y++){
        if(!this.board[x][y].isBomb){

          if(x-1 > 0 && y-1 > 0 && this.board[x-1][y-1].isBomb) this.board[x][y].bombCount += 1;
          if(x-1 > 0 && this.board[x-1][y].isBomb) this.board[x][y].bombCount += 1;
          if(x-1 > 0 && y+1 > this.board[0].length && this.board[x-1][y+1].isBomb) this.board[x][y].bombCount += 1;

          if(y-1 > 0 && this.board[x][y-1].isBomb) this.board[x][y].bombCount += 1;
          if(y+1 < this.board[0].length && this.board[x][y+1].isBomb) this.board[x][y].bombCount += 1;

          if(x+1 < this.board.length && y-1 > 0 && this.board[x+1][y-1].isBomb) this.board[x][y].bombCount += 1;
          if(x+1 < this.board.length && this.board[x+1][y].isBomb) this.board[x][y].bombCount += 1;
          if(x+1 < this.board.length && y+1 < this.board[0].length && this.board[x+1][y+1].isBomb) this.board[x][y].bombCount += 1;
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
      console.log(line);
      line = '';
    }
  }

  updateBoard(space: Space){
    if(space.isBomb){
      alert("KABLOOOM, game over")
    } else{
      this.reveal(space.x,space.y)
      space.isClicked = true;
    }
  }

  reveal(x: number, y: number){
    console.log(x);
    console.log(y);
    if(x > 0 && x < this.board.length && y > 0 && y < this.board[0].length && !this.board[x][y].isClicked && !this.board[x][y].isBomb){
      this.board[x][y].isClicked = true;
      if(this.board[x][y].bombCount === 0){
        console.log(`checking: (${x},${y})`)
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
}
