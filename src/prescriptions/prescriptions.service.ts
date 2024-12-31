import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    return await this.prisma.prescription.create({
      data: {
        medication: createPrescriptionDto.medication,
        dosage: createPrescriptionDto.dosage,
        frequency: createPrescriptionDto.frequency,
        startDate: new Date(createPrescriptionDto.startDate),
        endDate: new Date(createPrescriptionDto.endDate),
        doctorId: createPrescriptionDto.doctorId,
        patientId: createPrescriptionDto.patientId,
      },
    });
  }

  async findAll() {
    return await this.prisma.prescription.findMany({
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.prescription.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    return await this.prisma.prescription.update({
      where: { id },
      data: {
        medication: updatePrescriptionDto.medication,
        dosage: updatePrescriptionDto.dosage,
        frequency: updatePrescriptionDto.frequency,
        startDate: new Date(updatePrescriptionDto.startDate),
        endDate: new Date(updatePrescriptionDto.endDate),
        doctorId: updatePrescriptionDto.doctorId,
        patientId: updatePrescriptionDto.patientId,
      },
    });
  }

  async remove(id: string) {
    const prescriptions = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescriptions) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    await this.prisma.prescription.delete({
      where: { id },
    });

    return { message: `Prescriptions with ID ${id} was successfully deleted` };
  }

  async findPrescriptionsOfPatient(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { userId: id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return await this.prisma.prescription.findMany({
      where: {
        patientId: patient.id,
      },
    });
  }
}
