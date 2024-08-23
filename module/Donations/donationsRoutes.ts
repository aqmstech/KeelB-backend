import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {DonationsController} from "./donationsController";
import {
    addDonationsValidator,
    updateDonationsValidator,
    getAllDonationsValidator
} from "./donationsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const donationsController = new DonationsController(); // Create an instance of Controller

routes.use(requireUser);

routes.get('/', validateRequestParams(getAllDonationsValidator), (req: any, res: any) => {
    const donationsController = new DonationsController();
    donationsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const donationsController = new DonationsController();
    donationsController.getById(req, res)
});
routes.post('/', validateRequestBody(addDonationsValidator), (req: any, res: any) => {
    const donationsController = new DonationsController();
    donationsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateDonationsValidator), (req: any, res: any) => {
    const donationsController = new DonationsController();
    donationsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const donationsController = new DonationsController();
    donationsController.delete(req, res)
});


export const router = routes;