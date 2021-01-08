import { IsEmail, IsNotEmpty  } from 'class-validator';


export class loginAdminDto {
    @IsNotEmpty() password: string;
    @IsNotEmpty() @IsEmail() email: string;
    authToken : string
}
