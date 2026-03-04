import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ServiceRequestsService } from './service-requests.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

interface CreateServiceRequestDto {
  title: string;
  description?: string;
  budget?: number;
  currency?: string;
  categoryId?: string;
  requiredSkills?: string;
  location?: string;
  dueDate?: string;
}

interface ApplyToRequestDto {
  proposedPrice?: number;
  message?: string;
}

@Controller('service-requests')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: any,
    @Body() createDto: CreateServiceRequestDto,
  ) {
    if (!user?.id) {
      throw new BadRequestException('User not authenticated');
    }

    return this.serviceRequestsService.create({
      title: createDto.title,
      description: createDto.description,
      budget: createDto.budget,
      currency: createDto.currency || 'EUR',
      categoryId: createDto.categoryId,
      requiredSkills: createDto.requiredSkills,
      location: createDto.location,
      dueDate: createDto.dueDate ? new Date(createDto.dueDate) : undefined,
      customer: {
        connect: { id: user.id },
      },
    });
  }

  @Get()
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('categoryId') categoryId?: string,
    @Query('limit') limit: string = '20',
    @Query('offset') offset: string = '0',
  ) {
    return this.serviceRequestsService.findAll({
      customerId,
      status,
      categoryId,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const request = await this.serviceRequestsService.findById(id);
    if (!request) {
      throw new NotFoundException('Service request not found');
    }
    return request;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateDto: any,
  ) {
    const request = await this.serviceRequestsService.findById(id);
    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    if (request.customerId !== user.id) {
      throw new BadRequestException('You can only update your own requests');
    }

    return this.serviceRequestsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    const request = await this.serviceRequestsService.findById(id);
    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    if (request.customerId !== user.id) {
      throw new BadRequestException('You can only delete your own requests');
    }

    return this.serviceRequestsService.delete(id);
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  async applyToRequest(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() applyDto: ApplyToRequestDto,
  ) {
    if (!user?.id) {
      throw new BadRequestException('User not authenticated');
    }

    const request = await this.serviceRequestsService.findById(id);
    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    return this.serviceRequestsService.applyToRequest(id, user.id, {
      price: applyDto.proposedPrice,
      message: applyDto.message,
    });
  }

  @Post('generate-brief')
  @UseGuards(JwtAuthGuard)
  async generateBrief(
    @Body('title') title: string,
    @Body('description') description?: string,
  ) {
    if (!title) {
      throw new BadRequestException('Title is required');
    }

    return this.serviceRequestsService.generateBrief(title, description);
  }

  @Post('refine-brief')
  @UseGuards(JwtAuthGuard)
  async refineBrief(
    @Body('briefData') briefData: any,
    @Body('refinements') refinements: any,
  ) {
    if (!briefData) {
      throw new BadRequestException('Brief data is required');
    }

    return this.serviceRequestsService.refineBrief(briefData, refinements);
  }

  @Post('homepage/generate-brief')
  async generateHomepageBrief(@Body('topic') topic: string) {
    if (!topic) {
      throw new BadRequestException('Topic is required');
    }

    return this.serviceRequestsService.generateBrief(topic);
  }

  @Post('homepage/generate-services')
  async generateHomepageServices(@Body('category') category?: string) {
    // Placeholder for generating homepage services
    return {
      category,
      generatedAt: new Date(),
      services: [],
    };
  }
}
