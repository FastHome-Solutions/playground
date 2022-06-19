import { defineStore } from "pinia";
import gql from "graphql-tag";
import { apolloClient } from "@/graphql";
import type { BenefitMatrix, Header, TariffDetails } from "@/components/BenefitMatrix";
import type { CreateBenefitMatrixDto } from "@/dto/create-benefit-matrix.dto";

export const useBenefitMatrixStore = defineStore('BenefitStore', {
  state: () => ({
    benefitMatrix: {} as BenefitMatrix,
    benefitMatrices: [] as CreateBenefitMatrixDto[],
    loading: false,
    error: null,
  }),
  getters: {
    tariffs: (state) => state.benefitMatrix.tariffDetails,
    header: (state) => state.benefitMatrix.header,
  },
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

    uploadSpreadsheet(benefitMatrix: BenefitMatrix) {
      this.benefitMatrix = benefitMatrix
    },
  },
});
