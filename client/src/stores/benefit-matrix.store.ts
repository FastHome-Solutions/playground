import type {BenefitMatrix, Header, TariffDetails} from "@/components/BenefitMatrix";
import { defineStore } from "pinia";

export const useBenefitMatrixStore = defineStore({
  id: "BenefitMatrix",
  state: () => ({
    benefitMatrix: {},
  }),
  getters: {
    tariffs(): TariffDetails {
      return this.benefitMatrix.tariffDetails
    },
    headers(): Header {
      return this.benefitMatrix.header
    }
  },
  actions: {
    uploadSpreadsheet(benefitMatrix: BenefitMatrix) {
      this.benefitMatrix = benefitMatrix
    },
  },
});
