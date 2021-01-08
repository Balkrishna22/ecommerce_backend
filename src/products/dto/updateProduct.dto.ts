import { ObjectId } from "mongoose";
import { IsInt, IsNotEmpty, IsNumberString } from 'class-validator';


export class updateProductDto {
    @IsNotEmpty() productName: string;
     image: string;
    @IsNotEmpty() discription: string;
    @IsNotEmpty() category: string;
    @IsNumberString() price: number;
    readonly updateDate: Date;
    readonly createDate: Date;
    readonly status: boolean
    readonly id : ObjectId 
  }
  