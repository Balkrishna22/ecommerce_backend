import { ObjectId } from "mongoose";

export class updateProductDto {
    readonly productName: string;
    readonly discription: string;
    readonly category: string;
    readonly price : number;
    readonly updateDate : Date ;
    image : string ;
    readonly id : ObjectId
  }
  