import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical_history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical_history.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicalHistoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createMedicalHistoryDto: CreateMedicalHistoryDto) {
    const medical_histories = await this.prisma.medicalHistory.create({
      data: {
        diagnosis: createMedicalHistoryDto.diagnosis,
        treatment: createMedicalHistoryDto.treatment,
        notes: createMedicalHistoryDto.notes,
        patientId: createMedicalHistoryDto.patientId,
        doctorId: createMedicalHistoryDto.doctorId,
      },
    });

    return {
      message: `Medical Histories with ID #${medical_histories.id} created successfully`,
      data: medical_histories,
    };
  }

  async findAll() {
    return await this.prisma.medicalHistory.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.medicalHistory.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateMedicalHistoryDto: UpdateMedicalHistoryDto) {
    const medical_histories = await this.prisma.medicalHistory.update({
      where: { id },
      data: {
        diagnosis: updateMedicalHistoryDto.diagnosis,
        treatment: updateMedicalHistoryDto.treatment,
        notes: updateMedicalHistoryDto.notes,
        patientId: updateMedicalHistoryDto.patientId,
        doctorId: updateMedicalHistoryDto.doctorId,
      },
    });

    return {
      message: `Medical Histories with ID #${medical_histories.id} updated successfully`,
      data: medical_histories,
    };
  }

  async remove(id: string): Promise<{ message: string }> {
    const medical_historie = await this.prisma.medicalHistory.findUnique({
      where: { id },
    });

    if (!medical_historie) {
      throw new NotFoundException(`Medical Histories with ID ${id} not found`);
    }

    await this.prisma.medicalHistory.delete({
      where: { id },
    });

    return {
      message: `Medical Histories with ID ${id} was successfully deleted`,
    };
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
