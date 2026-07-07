import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { PatientsService } from '../patients/patients.service';
import { appRouter } from './app.router';
import { TrpcContext } from './trpc';

@Injectable()
export class TrpcService implements OnModuleInit {
  private readonly logger = new Logger(TrpcService.name);

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly patientsService: PatientsService,
  ) {}

  onModuleInit() {
    const app = this.httpAdapterHost.httpAdapter.getInstance();

    app.use(
      '/trpc',
      createExpressMiddleware({
        router: appRouter,
        createContext: (): TrpcContext => ({ patientsService: this.patientsService }),
      }),
    );

    this.logger.log('tRPC endpoint mounted at /trpc');
  }
}
