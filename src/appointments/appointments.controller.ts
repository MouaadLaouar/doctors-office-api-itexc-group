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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Roles } from 'src/roles.decorator';
import { UserRole } from '@prisma/client';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('appointments')
@Roles(UserRole.DOCTOR)
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // for patient only
  @Get('patient')
  @Roles(UserRole.PATIENT)
  getpatient(@Req() req: Request) {
    const access_token = req.cookies.access_token;

    const decoded = this.jwtService.verify(access_token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return this.appointmentsService.findWithUserId(decoded.sub);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Post()
  create(@Body() CreateAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(CreateAppointmentDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
