import express from "express";
import { DashboardController } from "./dashboardController";
import requireAdmin from "../../controllers/global/requiredAdmin";
const routes = express.Router();


routes.get("/",requireAdmin,DashboardController.dashboardStats);

export const router = routes;