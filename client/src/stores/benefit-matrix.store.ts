import { defineStore } from "pinia";
import gql from "graphql-tag";
import { apolloClient } from "@/graphql";
import type { BenefitMatrixDto } from "@/dto/benefit-matrix.dto";

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
          benefitMatrices { _id brand portfolio }
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
      });
    },
    fetchBenefitMatrixFromServer(bmId: String) {
      this.loading = true;
      apolloClient.query({
        query: gql`query BenefitMatrix($id:String!) {
          benefitMatrix(id:$id) {
            _id
            period {
              from
              to
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
        });
    },

    uploadSpreadsheet(benefitMatrix: BenefitMatrixDto) {
      this.benefitMatrix = benefitMatrix
    },
  },
});
