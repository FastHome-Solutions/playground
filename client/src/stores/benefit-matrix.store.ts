import { defineStore } from "pinia"
import gql from "graphql-tag"
import { apolloClient } from "@/graphql"
import type { BenefitMatrixInputType } from "@/dto/benefit-matrix.dto"

export const useBenefitMatrixStore = defineStore('BenefitStore', {
  state: () => ({
    benefitMatrix: {} as BenefitMatrixInputType,
    previousBenefitMatrix: {} as BenefitMatrixInputType,
    nextBenefitMatrix: {} as BenefitMatrixInputType,
    benefitMatrices: [] as BenefitMatrixInputType[],
    loading: false,
    error: null,
  }),
  getters: {},
  actions: {
    fetchBenefitMatricesFromServer() {
      this.loading = true;
      apolloClient.query({
        query: gql`query {
          benefitMatrices { 
            _id 
            brand 
            portfolio 
            period {
              from
              till
            }
          }
        }`,
      })
      .then((result) => {
        console.log(result);
        this.benefitMatrices = result.data.benefitMatrices;
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
      });
    },
    fetchBenefitMatrixFromServer(bmId: String): Promise<void> {
      this.loading = true;
      return apolloClient.query({
        query: gql`query BenefitMatrix($id:String!) {
          benefitMatrix(id:$id){
            _id
            brand
            period {
              from
              till
            }
            portfolio
            tariffNames
            deviceConfigurations {
              manufacturer
              deviceName
              tco
              contractConfigurations {
                duration
                upfronts
                tariffConfigurations {
                  name
                  discount
                  voucherName
                  bundlePrices
                }
              }
            }
          }
          prevBenefitMatrix(id: $id) {
            _id
            period{
              from
              till
            }
          }
          nextBenefitMatrix(id: $id) {
            _id
            period{
              from
              till
            }
          }
        }
        `,
        variables: {
          id: bmId,
        },
      })
      .then((result) => {
        console.log(result);
        this.benefitMatrix = result.data.benefitMatrix
        this.previousBenefitMatrix = result.data.prevBenefitMatrix
        this.nextBenefitMatrix = result.data.nextBenefitMatrix
        this.loading = false
      })
      .catch((error) => {
        console.error(error)
        this.error = error
        this.loading = false
      });
    },
    uploadSpreadsheetToServer(benefitMatrixDto: BenefitMatrixInputType): Promise<void> {
      this.benefitMatrix = benefitMatrixDto

      this.loading = true;
      return apolloClient.mutate({
        mutation: gql`mutation CreateBenefitMatrix($benefitMatrix: BenefitMatrixInputType!) {
            createBenefitMatrix(benefitMatrix: $benefitMatrix) {
              _id
            }
          }`,
        variables: {
          benefitMatrix: benefitMatrixDto,
        }
      })
      .then((result) => {
        console.log(result);
        this.benefitMatrix = result.data.createBenefitMatrix;
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
      })
    },
    updateBenefitMatrixOnServer(benefitMatrixDto: BenefitMatrixInputType): Promise<void> {
    this.loading = true;
    return apolloClient.mutate({
      mutation: gql`mutation UpdateBenefitMatrix($benefitMatrix: BenefitMatrixInputType!) {
        updateBenefitMatrix(benefitMatrix: $benefitMatrix) {
          _id
          brand
          period {
            from
            till
          }
          portfolio
          tariffNames
          deviceConfigurations {
            manufacturer
            deviceName
            tco
            contractConfigurations {
              duration
              upfronts
              tariffConfigurations {
                name
                discount
                voucherName
                bundlePrices
              }
            }
          }
        }
      }`,
      variables: {
        benefitMatrix: benefitMatrixDto,
      },
    })
      .then((result) => {
        console.log(result)
        this.benefitMatrix = result.data.updateBenefitMatrix
        this.loading = false
      })
      .catch((error) => {
        console.error(error)
        this.error = error
        this.loading = false
      })
    },
  },
});
