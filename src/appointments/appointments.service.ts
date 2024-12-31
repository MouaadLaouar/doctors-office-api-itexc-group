import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}
  async create(createAppointmentDto: CreateAppointmentDto) {
    const appointment = await this.prisma.appointment.create({
      data: {
        dateAndTime: new Date(createAppointmentDto.dateAndTime),
        reason: createAppointmentDto.reason,
        patientId: createAppointmentDto.patientId,
        doctorId: createAppointmentDto.doctorId,
      },
    });

    return {
      message: `Appointment with ID #${appointment.id} created successfully`,
      data: appointment,
    };
  }

  async findAll() {
    return await this.prisma.appointment.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.appointment.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID #${id} not found`);
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: updateAppointmentDto,
    });

    return {
      message: `Appointment with ID #${id} has been successfully updated`,
      data: updatedAppointment,
    };
  }

  async remove(id: string): Promise<{ message: string }> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    await this.prisma.appointment.delete({
      where: { id },
    });

    return { message: `Appointment with ID ${id} was successfully deleted` };
  }

  async findWithUserId(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId: id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return await this.prisma.appointment.findMany({
      where: {
        patientId: patient.id,
      },
    });
  }
}
