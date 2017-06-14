export class Space {
  mineCount: number;
  isBomb: boolean = false;
  isClicked: boolean = false;
  constructor(public x: number, public y: number){}
}
