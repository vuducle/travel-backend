import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Global,
  Module,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Ensure PrismaClient is constructed
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super();
  }
  async onModuleInit() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await super.$connect();
  }

  async onModuleDestroy() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    await super.$disconnect();
  }
}

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
