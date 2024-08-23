import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { CountryController } from "./countryController";
import {
    addCountryValidator,
    updateCountryValidator,
    getAllCountryValidator
} from "./countryValidator";

import { validateRequestBody, validateRequestParams } from "../../utils/validator/ValidateRequest";

// const countryController = new CountryController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllCountryValidator), (req: any, res: any) => {
    const countryController = new CountryController();
    countryController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const countryController = new CountryController();
    countryController.getById(req, res)
});
routes.post('/', validateRequestBody(addCountryValidator), (req: any, res: any) => {
    const countryController = new CountryController();
    countryController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateCountryValidator), (req: any, res: any) => {
    const countryController = new CountryController();
    countryController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const countryController = new CountryController();
    countryController.delete(req, res)
});


export const router = routes;