export class Space {
  bombCount: number = 0;
  isBomb: boolean = false;
  isClicked: boolean = false;
  clickedStatus: string = "hidden"
  isFlagged: boolean = false;
  constructor(public x: number, public y: number){}
}
