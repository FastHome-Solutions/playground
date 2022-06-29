import { Field, ObjectType } from "@nestjs/graphql";
import { BenefitMatrix } from "../schemas/benefit-matrix.schema";
import { CreateBenefitMatrixDto } from "./create-benefit-matrix.dto";

@ObjectType()
export class GetBenefitMatrixDto {

  constructor(benefitMatrix: BenefitMatrix, previous: BenefitMatrix, next: BenefitMatrix) {
    this.benefitMatrix = benefitMatrix
    this.previous = previous
    this.next = next
  }

  @Field(() => BenefitMatrix)
  benefitMatrix: BenefitMatrix


  @Field(() => BenefitMatrix, { nullable: true })
  previous: BenefitMatrix


  @Field(() => BenefitMatrix, {nullable: true})
  next: BenefitMatrix
}

