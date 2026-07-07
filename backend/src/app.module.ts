import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PatientsModule } from './patients/patients.module';
import { TrpcModule } from './trpc/trpc.module';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, PatientsModule, TrpcModule],
  controllers: [AppController],
})
export class AppModule {}
