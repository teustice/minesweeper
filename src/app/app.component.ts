import { Component } from '@angular/core';
import { Space } from './space.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  board = [];
  difficulty: number = 0;
  difficultySettings: [] = [
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

  genBoard(difficultySetting: number) {
    let difficulty = difficultySettings[difficultySetting];
    for(let x = 0; x < difficulty.x; x++){
      this.board.push([]);
    }

    for(let x = 0; x < difficulty.x; x++){
      for(let y = 0; y < difficulty.y; y++){
        this.board[x].push(new Space(x,y));
      }
    }
    this.genBombs(difficulty.bombs);
  }
}
