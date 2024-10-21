import express from "express";
import { PaymentController } from "./paymentController";
const routes = express.Router();


routes.post("/stripe/webhook",PaymentController.handleStripeWebhook);

export const router = routes;