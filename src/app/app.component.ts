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
  }
}
