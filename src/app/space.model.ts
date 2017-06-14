export class Space {
  bombCount: number = 0;
  isBomb: boolean = false;
  isClicked: boolean = false;
  constructor(public x: number, public y: number){}
}
