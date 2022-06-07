import { NotFoundException } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { BanefitMatricesService } from "./benefit-matrices.service";
import { BenefitMatrix } from "./schemas/benefit-matrix.schema";
import { BenefitMatricesArgs } from "./dto/benefit-matrices.args";

@Resolver(of => BenefitMatrix)
export class BenefitMatrixResolver {
  constructor (private readonly benefitMatricesService: BanefitMatricesService) { }

  @Query(returns => [BenefitMatrix])
  benefitMatrices(@Args() benefitMatricesArgs: BenefitMatricesArgs): Promise<BenefitMatrix[]> {
    return this.benefitMatricesService.findAll(benefitMatricesArgs);
  }

  @Query(returns => BenefitMatrix)
  async benefitMatrix(@Args('id') id: string): Promise<BenefitMatrix> {
    const benefitMatrix = await this.benefitMatricesService.findOneById(id);
    if (!benefitMatrix) {
      throw new NotFoundException(id);
    }
    return benefitMatrix;
  }
}
