import { IsEmail, IsNotEmpty } from 'class-validator';


export class loginAdminDto {
    @IsNotEmpty() password: string;
    @IsEmail() email: string;
 }
 