import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { RegionsController } from "./regionsController";
import {
    addRegionsValidator,
    updateRegionsValidator,
    getAllRegionsValidator
} from "./regionsValidator";

import { validateRequestBody, validateRequestParams } from "../../utils/validator/ValidateRequest";

// const regionsController = new RegionsController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllRegionsValidator), (req: any, res: any) => {
    const regionsController = new RegionsController();
    regionsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const regionsController = new RegionsController();
    regionsController.getById(req, res)
});
routes.post('/', validateRequestBody(addRegionsValidator), (req: any, res: any) => {
    const regionsController = new RegionsController();
    regionsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateRegionsValidator), (req: any, res: any) => {
    const regionsController = new RegionsController();
    regionsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const regionsController = new RegionsController();
    regionsController.delete(req, res)
});


export const router = routes;