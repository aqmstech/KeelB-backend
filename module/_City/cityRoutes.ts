import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { CityController } from "./cityController";
import {
    addCityValidator,
    updateCityValidator,
    getAllCityValidator
} from "./cityValidator";

import { validateRequestBody, validateRequestParams } from "../../utils/validator/ValidateRequest";

// const cityController = new CityController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllCityValidator), (req: any, res: any) => {
    const cityController = new CityController();
    cityController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const cityController = new CityController();
    cityController.getById(req, res)
});
routes.post('/', validateRequestBody(addCityValidator), (req: any, res: any) => {
    const cityController = new CityController();
    cityController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateCityValidator), (req: any, res: any) => {
    const cityController = new CityController();
    cityController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const cityController = new CityController();
    cityController.delete(req, res)
});


export const router = routes;