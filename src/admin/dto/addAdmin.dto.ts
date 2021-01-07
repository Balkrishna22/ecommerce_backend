import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddAdminDto {
    @IsNotEmpty() name: string;
     password: string;
    @IsEmail() email: string;
    readonly createDate: Date;
    readonly updateDate: Date;
    readonly status: string;
    readonly authToken: string;
  }
  