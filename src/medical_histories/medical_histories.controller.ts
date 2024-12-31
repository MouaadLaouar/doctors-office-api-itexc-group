import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MedicalHistoriesService } from './medical_histories.service';
import { CreateMedicalHistoryDto } from './dto/create-medical_history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical_history.dto';
import { Roles } from 'src/roles.decorator';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('medical-histories')
@Roles(UserRole.DOCTOR)
export class MedicalHistoriesController {
  constructor(
    private readonly medicalHistoriesService: MedicalHistoriesService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createMedicalHistoryDto: CreateMedicalHistoryDto) {
    return this.medicalHistoriesService.create(createMedicalHistoryDto);
  }

  @Get()
  findAll() {
    return this.medicalHistoriesService.findAll();
  }

  // for patient only
  @Get('patient')
  @Roles(UserRole.PATIENT)
  getpatient(@Req() req: Request) {
    const access_token = req.cookies.access_token;

    const decoded = this.jwtService.verify(access_token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return this.medicalHistoriesService.findWithUserId(decoded.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalHistoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ) {
    return this.medicalHistoriesService.update(id, updateMedicalHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalHistoriesService.remove(id);
  }
}
