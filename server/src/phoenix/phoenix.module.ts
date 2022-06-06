import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BenefitMatricesModule } from './benefit-matrices/benefit-matrices.module';

const MONGODB_URL = process.env.MONGODB_URL_PHOENIX || process.env.MONGODB_URL || 'mongodb://localhost:27017/phoenix';

@Module({
    imports: [
        MongooseModule.forRoot(MONGODB_URL, { connectionName: 'PhoenixDbConnection' }),
        BenefitMatricesModule,
    ],
})
export class PhoenixModule {}
