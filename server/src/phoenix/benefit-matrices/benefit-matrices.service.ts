import { Model } from 'mongoose';
import { Injectable, Logger, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateBenefitMatrixDto } from './dto/create-benefit-matrix.dto';
import { BenefitMatrix, BenefitMatrixDocument } from './schemas/benefit-matrix.schema';

@Injectable()
export class BanefitMatricesService {
  private logger: Logger;

  constructor (@InjectModel(BenefitMatrix.name) private readonly benefitMatrixModel: Model<BenefitMatrixDocument>) {
    this.logger = new Logger('BanefitMatricesService', { timestamp: false });
  }

  async create (createBenefitMatrixDto: CreateBenefitMatrixDto): Promise<BenefitMatrix> {
    this.logger.log(`create called with ${JSON.stringify(createBenefitMatrixDto)}`);
    const createdBenefitMatrix = new this.benefitMatrixModel(createBenefitMatrixDto);
    return await createdBenefitMatrix.save();
  }

  async findOneById(id: string): Promise<BenefitMatrix> {
    this.logger.log(`findOneById called with ${id}`);
    return await this.benefitMatrixModel.findOne({ _id: id }).exec();
  }

  async findAll (@Query() query): Promise<BenefitMatrix[]> {
    this.logger.log(`findAll called with ${JSON.stringify(query)}`);
    const result = await this.benefitMatrixModel.find(query).exec();
    this.logger.log(`findAll returned ${result.length}`);
    return result;
  }
}
