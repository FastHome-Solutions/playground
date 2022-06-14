import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { CreateBenefitMatrixDto } from './dto/create-benefit-matrix.dto';
import { BanefitMatricesService } from './benefit-matrices.service';
import { BenefitMatrix } from './schemas/benefit-matrix.schema';

@Controller('benefit-matrices')
export class BanefitMatricesController {
  constructor (private readonly benefitMatricesService: BanefitMatricesService) { }

  @Post()
  async create (@Body() createBenefitMatrixDto: CreateBenefitMatrixDto) {
    this.benefitMatricesService.create(createBenefitMatrixDto);
  }

  @Get()
  async findAll (@Query() query): Promise<BenefitMatrix[]> {
    return this.benefitMatricesService.findAll(query);
  }

  @Get(':id')
  findOne (@Param('id') id) {
    return this.benefitMatricesService.findOneById(id);
  }

  @Put(':id')
  update (@Param('id') id, @Body() updateBanefitMatrixDto) {
    return `This action updates the #${id} object`;
  }

  @Delete(':id')
  remove (@Param('id') id) {
    return `This action removes the #${id} object`;
  }

}
