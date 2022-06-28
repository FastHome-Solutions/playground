import { defineStore } from "pinia"
import gql from "graphql-tag"
import { apolloClient } from "@/graphql"
import type { BenefitMatrixDto } from "@/dto/benefit-matrix.dto"

export const useBenefitMatrixStore = defineStore('BenefitStore', {
  state: () => ({
    benefitMatrix: {} as BenefitMatrixDto,
    benefitMatrices: [] as BenefitMatrixDto[],
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
              to
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
    fetchBenefitMatrixFromServer(bmId: String): Promise {
      this.loading = true;
      return apolloClient.query({
        query: gql`query BenefitMatrix($id:String!) {
          benefitMatrix(id:$id){
            _id
            brand
            period {
              from
              to
            }
            portfolio
            tariffNames
            metaOffers {
              manufacturer
              deviceName
              tco
              offers {
                contractDuration
                tarifName
                discount
                voucherName
                upfront
                bundlePrice
              }
            }
          }
        }`,
        variables: {
          id: bmId
        },
      })
      .then((result) => {
        console.log(result);
        this.benefitMatrix = result.data.benefitMatrix;
        this.loading = false;
      })
      .catch((error) => {
        console.error(error);
        this.error = error;
        this.loading = false;
      });
    },
    uploadSpreadsheetToServer(benefitMatrixDto: BenefitMatrixDto): Promise {
      this.benefitMatrix = benefitMatrixDto

      this.loading = true;
      return apolloClient.mutate({
        mutation: gql`mutation CreateBenefitMatrix($benefitMatrix: CreateBenefitMatrixDto!) {
            createBenefitMatrix(benefitMatrix: $benefitMatrix) {
              _id
            }
          }`,
        variables: {
          benefitMatrix: benefitMatrixDto
        },
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
  },
});
