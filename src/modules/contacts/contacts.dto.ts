import { User } from '../../models/User';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsIn,
  IsOptional,
  IsUUID,
  IsEmail,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class CreateOrUpdateContactDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  subject: string;

  @IsNotEmpty()
  @IsInt()
  countryId: number;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsBoolean()
  isRed: boolean;

  @IsNotEmpty()
  @IsString()
  description: string;
}