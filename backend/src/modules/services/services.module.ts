import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServiceRequestsController } from './service-requests.controller';
import { ServiceRequestsService } from './service-requests.service';
import { PrismaModule } from '@/common/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController, ServiceRequestsController],
  providers: [ServicesService, ServiceRequestsService],
  exports: [ServicesService, ServiceRequestsService],
})
export class ServicesModule {}
