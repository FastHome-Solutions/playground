import { Model } from 'mongoose';
import { Injectable, Logger, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateBenefitMatrixDto } from './dto/create-benefit-matrix.dto';
import { BenefitMatrix, BenefitMatrixDocument } from './schemas/benefit-matrix.schema';
import { GetBenefitMatrixDto } from './dto/get-benefit-matrix.dto';

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

  async findPreviousByDate(currentDate: Date): Promise<BenefitMatrix> {
    this.logger.log(`findPreviousByDate called with ${currentDate}`);
    return await this.benefitMatrixModel.findOne({ "period.from": { $lt: currentDate } }).sort({ "period.from": -1 }).exec();
  }

  async findNextByDate(currentDate: Date): Promise<BenefitMatrix> {
    this.logger.log(`findNextByDate called with ${currentDate}`);
    return await this.benefitMatrixModel.findOne({ "period.from": { $gt: currentDate } }).sort({ "period.from": 1 }).exec();
  }

  async findAll (@Query() query): Promise<BenefitMatrix[]> {
    this.logger.log(`findAll called with ${JSON.stringify(query)}`);
    const result = await this.benefitMatrixModel.find(query).exec();
    this.logger.log(`findAll returned ${result.length}`);
    return result;
  }
}
