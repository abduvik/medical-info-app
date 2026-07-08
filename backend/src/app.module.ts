import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { PatientsModule } from "./patients/patients.module";
import { AppController } from "./app.controller";
import { TRPCModule } from "nestjs-trpc";

@Module({
  imports: [PrismaModule, PatientsModule, TRPCModule.forRoot({})],
  controllers: [AppController],
})
export class AppModule {}
