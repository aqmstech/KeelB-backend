import requireUser from "../../controllers/global/requiredUser";

import express from "express";
import { PaymentController } from "./paymentController";
import {validateRequestBody} from "../../utils/validator/ValidateRequest";
import {addDonationsValidator} from "../Donations/donationsValidator";
const routes = express.Router();


routes.post("/", validateRequestBody(addDonationsValidator),requireUser,PaymentController.proceedPayment);
routes.post("/stripe/webhook",PaymentController.handleStripeWebhook);

export const router = routes;