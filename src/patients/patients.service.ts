import { Injectable } from '@nestjs/common';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.patient.findMany({
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: true,
        prescriptions: true,
        medicalHistory: true,
      },
    });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    return await this.prisma.patient.update({
      where: { id },
      data: {
        name: updatePatientDto.name,
        dateOfBirth: updatePatientDto.dateOfBirth,
        address: updatePatientDto.address,
      },
    });
  }
}
