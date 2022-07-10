import { Model } from 'mongoose';
import { Injectable, Logger, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateBenefitMatrixDto } from './dto/create-benefit-matrix.dto';
import { BenefitMatrix, BenefitMatrixDocument } from './schemas/benefit-matrix.schema';

@Injectable()
export class BanefitMatricesService {
  private logger: Logger;

  constructor(@InjectModel(BenefitMatrix.name) private readonly benefitMatrixModel: Model<BenefitMatrixDocument>) {
    this.logger = new Logger('BanefitMatricesService', { timestamp: false });
  }

  async create(createBenefitMatrixDto: CreateBenefitMatrixDto): Promise<BenefitMatrix> {
    this.logger.log(`create called with ${JSON.stringify(createBenefitMatrixDto)}`);
    const createdBenefitMatrix = new this.benefitMatrixModel(createBenefitMatrixDto);
    return await createdBenefitMatrix.save();
  }

  async findOneById(id: string): Promise<BenefitMatrix> {
    this.logger.log(`findOneById called with ${id}`);
    const result = await this.benefitMatrixModel.findOne({ _id: id }).exec();
    return this.migrateBenefitMatrix(result.toJSON());
  }

  async findPreviousByDate(currentDate: Date): Promise<BenefitMatrix> {
    this.logger.log(`findPreviousByDate called with ${currentDate}`);
    return await this.benefitMatrixModel.findOne({ "period.from": { $lt: currentDate } }).sort({ "period.from": -1 }).exec();
  }

  async findNextByDate(currentDate: Date): Promise<BenefitMatrix> {
    this.logger.log(`findNextByDate called with ${currentDate}`);
    return await this.benefitMatrixModel.findOne({ "period.from": { $gt: currentDate } }).sort({ "period.from": 1 }).exec();
  }

  async findAll(@Query() query): Promise<BenefitMatrix[]> {
    this.logger.log(`findAll called with ${JSON.stringify(query)}`);
    const result = await this.benefitMatrixModel.find(query).exec();
    this.logger.log(`findAll returned ${result.length}`);
    return result.map(model => model.toJSON()).map(this.migrateBenefitMatrix);
  }

  async update(id: String, createBenefitMatrixDto: CreateBenefitMatrixDto): Promise<BenefitMatrix> {
    this.logger.log(`update called with id ${id} and ${JSON.stringify(createBenefitMatrixDto)}`);
    return await this.benefitMatrixModel.findOneAndUpdate({ _id: id }, createBenefitMatrixDto, { useFindAndModify: false, new: true });
  }

  migrateBenefitMatrix (benefitMatrix) {
    const { _id, brand, campaign, period, portfolio, tariffNames, metaOfferList } = benefitMatrix;
    if (metaOfferList === undefined) return benefitMatrix;
    const deviceConfigurations = metaOfferList.map(this.createDeviceConfiguration(tariffNames));
    return { _id, brand, campaign, period, portfolio, tariffNames, deviceConfigurations };
  }

  createDeviceConfiguration (tariffNames) {
    return (metaOffer) => {
      const { manufacturer, deviceName, tco, durationDependentData } = metaOffer;
      if (durationDependentData === undefined) return metaOffer
      const contractConfigurations = durationDependentData.map(this.createContractConfiguration(tariffNames));
      return { manufacturer, deviceName, tco, contractConfigurations };
    }
  }

  createContractConfiguration (tariffNames) {
    return (durationDependentData) => {
      const { contractDuration, upfronts, voucherNames, discounts, bundlePrices } = durationDependentData;
      const tariffConfigurations = tariffNames.map(
        (name, i) => ({
          name,
          discount: discounts[i],
          voucherName: voucherNames[i],
          bundlePrices: bundlePrices.map(bp => bp[i]),
        })
      );
      return { duration: contractDuration, upfronts, tariffConfigurations };
    }
  }
}
