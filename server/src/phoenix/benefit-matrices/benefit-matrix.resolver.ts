import { NotFoundException, Logger } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BanefitMatricesService } from "./benefit-matrices.service";
import { BenefitMatrix } from "./schemas/benefit-matrix.schema";
import { BenefitMatricesArgs } from "./dto/benefit-matrices.args";
import { CreateBenefitMatrixDto } from "./dto/create-benefit-matrix.dto";

@Resolver(of => BenefitMatrix)
export class BenefitMatrixResolver {
  private logger: Logger;

  constructor (private readonly benefitMatricesService: BanefitMatricesService) {
    this.logger = new Logger('BanefitMatricesService', { timestamp: false });
  }

  @Query(returns => [BenefitMatrix])
  benefitMatrices(@Args() benefitMatricesArgs: BenefitMatricesArgs): Promise<BenefitMatrix[]> {
    this.logger.log(`benefitMatrices called with ${JSON.stringify(benefitMatricesArgs)}`);
    return this.benefitMatricesService.findAll({});
  }

  @Query(returns => BenefitMatrix)
  async benefitMatrix(@Args('id') id: string): Promise<BenefitMatrix> {
    const benefitMatrix = await this.benefitMatricesService.findOneById(id);
    if (!benefitMatrix) {
      throw new NotFoundException(id);
    }
    return benefitMatrix;
  }

  @Query(returns => BenefitMatrix, { nullable: true })
  async prevBenefitMatrix(@Args('id') id: string): Promise<BenefitMatrix> {
    const benefitMatrix = await this.benefitMatricesService.findOneById(id);
    if (!benefitMatrix) {
      throw new NotFoundException(id);
    }
    return await this.benefitMatricesService.findPreviousByDate(benefitMatrix.period.from);
  }

  @Query(returns => BenefitMatrix, { nullable: true })
  async nextBenefitMatrix(@Args('id') id: string): Promise<BenefitMatrix> {
    const benefitMatrix = await this.benefitMatricesService.findOneById(id);
    if (!benefitMatrix) {
      throw new NotFoundException(id);
    }
    return await this.benefitMatricesService.findNextByDate(benefitMatrix.period.from);
  }

  @Mutation(returns => BenefitMatrix)
  async createBenefitMatrix(@Args('benefitMatrix') benefitMatrix: CreateBenefitMatrixDto) {
      return await this.benefitMatricesService.create(benefitMatrix);
  }

  @Mutation(returns => BenefitMatrix)
  async updateBenefitMatrix(@Args('id') id: String, @Args('benefitMatrix') benefitMatrix: CreateBenefitMatrixDto) {
    return await this.benefitMatricesService.update(id, benefitMatrix);
  }
} 
