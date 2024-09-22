import express from "express";
import { DashboardController } from "./dashboardController";
import requireAdmin from "../../controllers/global/requiredAdmin";
import requireUser from "../../controllers/global/requiredUser";
const routes = express.Router();


routes.get("/",requireUser,DashboardController.dashboardStats);

export const router = routes;