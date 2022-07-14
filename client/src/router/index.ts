import { createRouter, createWebHistory } from "vue-router"
import DashboardView from "../views/DashboardView.vue"
import BenefitMatricesView from "@/views/BenefitMatricesView.vue"
import BenefitMatrixView from "@/views/BenefitMatrixView.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/benefit-matrices",
      name: "benefit-matrices",
      component: BenefitMatricesView,
    },
    {
      path: "/benefit-matrix/:id",
      name: "benefit-matrix",
      component: BenefitMatrixView,
    },
    {
      path: "/benefit-matrix",
      name: "edit-benefit-matrix",
      component: BenefitMatrixView,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
