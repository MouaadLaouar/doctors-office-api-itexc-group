import { PartialType } from '@nestjs/mapped-types';
import { PatientDto } from './patient.dto';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdatePatientDto extends PartialType(PatientDto) {
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
