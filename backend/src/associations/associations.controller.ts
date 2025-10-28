import { Controller, Post, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AssociationsService } from './associations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('associations')
@Controller('associations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AssociationsController {
  constructor(private associationsService: AssociationsService) {}

  @Post('discover')
  @ApiOperation({ summary: 'Discover a new association' })
  @ApiQuery({ name: 'category', example: 'animal' })
  @ApiQuery({ name: 'subcategory', required: false, example: 'naruto' })
  @ApiResponse({ status: 201, description: 'Association discovered' })
  async discover(
    @Request() req: any,
    @Query('category') category: string,
    @Query('subcategory') subcategory?: string,
  ) {
    return this.associationsService.discoverAssociation(req.user.id, category, subcategory);
  }

  @Get()
  @ApiOperation({ summary: 'Get all associations' })
  @ApiResponse({ status: 200, description: 'Associations retrieved' })
  async getAll(@Request() req: any) {
    return this.associationsService.getAssociations(req.user.id);
  }

  @Get('by-category')
  @ApiOperation({ summary: 'Get associations by category' })
  @ApiQuery({ name: 'category', example: 'anime' })
  @ApiResponse({ status: 200, description: 'Associations retrieved' })
  async getByCategory(@Request() req: any, @Query('category') category: string) {
    return this.associationsService.getAssociationsByCategory(req.user.id, category);
  }
}
