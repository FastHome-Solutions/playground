import { defineStore } from "pinia";
import type { BenefitMatrix, Header, TariffDetails } from "@/components/BenefitMatrix";

export const useBenefitMatrixStore = defineStore('BenefitStore', {
  state: () => ({
    benefitMatrix: {} as BenefitMatrix,
  }),
  getters: {
    tariffs: (state) => state.benefitMatrix.tariffDetails,
    header: (state) => state.benefitMatrix.header,
  },
  actions: {
    uploadSpreadsheet(benefitMatrix: BenefitMatrix) {
      this.benefitMatrix = benefitMatrix
    },
  },
});
