import { Module } from "@nestjs/common";
import { PatientsService } from "./patients.service";
import { MockApiService } from "../mock-api/mock-api.service";
import { PatientsRouter } from "./patients.router";

@Module({
  providers: [PatientsService, MockApiService, PatientsRouter],
  exports: [PatientsService],
})
export class PatientsModule {}
