import { Module } from '@nestjs/common';
import { PatientsModule } from '../patients/patients.module';
import { TrpcService } from './trpc.service';

@Module({
  imports: [PatientsModule],
  providers: [TrpcService],
})
export class TrpcModule {}
