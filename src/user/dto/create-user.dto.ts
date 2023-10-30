import { IsDate, IsEmail, IsNotEmpty, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @MaxDate(require('moment')().subtract(6, 'y').toDate())
  dateOfBirth: Date;
  firstName?: string;
  lastName?: string;
}
