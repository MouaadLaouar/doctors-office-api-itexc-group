import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreatePrescriptionDto {
  @IsNotEmpty()
  @IsString()
  medication: string;

  @IsNotEmpty()
  @IsString()
  dosage: string;

  @IsNotEmpty()
  @IsString()
  frequency: string;

  @IsNotEmpty()
  @IsDateString()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string;
}
