import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { MockApiService } from './mock-api.service';

@Module({
  providers: [PatientsService, MockApiService],
  exports: [PatientsService],
})
export class PatientsModule {}
