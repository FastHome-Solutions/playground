import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BenefitMatrix, BenefitMatrixSchema } from './schemas/benefit-matrix.schema';
import { BanefitMatricesController } from './benefit-matrices.controller';
import { BanefitMatricesService } from './benefit-matrices.service';
import { BenefitMatrixResolver } from './benefit-matrix.resolver';

@Module({
    imports: [MongooseModule.forFeature([{ name: BenefitMatrix.name, schema: BenefitMatrixSchema }], 'PhoenixDbConnection')],
    controllers: [BanefitMatricesController],
    providers: [BanefitMatricesService, BenefitMatrixResolver],
})
export class BenefitMatricesModule {}
