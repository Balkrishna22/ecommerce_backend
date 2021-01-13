import {  IsNotEmpty, IsNumberString } from 'class-validator';



export class AddProductDto {
    @IsNotEmpty() productName: string;
    @IsNotEmpty() image;
    @IsNotEmpty() discription: string;
    @IsNotEmpty() category: string;
    @IsNumberString() price: number;
    readonly updateDate: Date;
    readonly createDate: Date;
    readonly status: string
}
