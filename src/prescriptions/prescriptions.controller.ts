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
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Roles } from 'src/roles.decorator';
import { UserRole } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Controller('prescriptions')
@Roles(UserRole.DOCTOR)
export class PrescriptionsController {
  constructor(
    private readonly prescriptionsService: PrescriptionsService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionsService.create(createPrescriptionDto);
  }

  @Get('patient')
  @Roles(UserRole.PATIENT)
  getprescriptionpatient(@Req() req: Request) {
    const access_token = req.cookies.access_token;

    const decoded = this.jwtService.verify(access_token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return this.prescriptionsService.findPrescriptionsOfPatient(decoded.sub);
  }

  @Get()
  findAll() {
    return this.prescriptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionsService.remove(id);
  }
}
