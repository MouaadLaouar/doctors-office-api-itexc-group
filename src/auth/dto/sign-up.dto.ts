import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  specialization?: string; // For doctors

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string; // For patients

  @IsOptional()
  @IsString()
  address?: string; // For patients
}
