import {  IsNotEmpty, IsNumberString } from 'class-validator';



export class deleteImageDto {
    @IsNotEmpty() deleteImage
    @IsNotEmpty() image
    @IsNotEmpty() productid  
}
