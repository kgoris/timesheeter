export class User{
  firstname: string;
  lastname: string;
  password: string;
  username: string;
  id: number;
  new: boolean;
  selected:boolean = false;
  active:boolean;
  constructor(){}
  clone(): any {
    var cloneObj = new (<any>this.constructor());
    for (var attribut in this) {
      if (typeof this[attribut] === "object") {
        cloneObj[attribut] = this.clone();
      } else {
        cloneObj[attribut] = this[attribut];
      }
    }
    return cloneObj;
  }
}
