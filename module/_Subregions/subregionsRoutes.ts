import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { SubregionsController } from "./subregionsController";
import {
    addSubregionsValidator,
    updateSubregionsValidator,
    getAllSubregionsValidator
} from "./subregionsValidator";

import { validateRequestBody, validateRequestParams } from "../../utils/validator/ValidateRequest";

// const subregionsController = new SubregionsController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllSubregionsValidator), (req: any, res: any) => {
    const subregionsController = new SubregionsController();
    subregionsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const subregionsController = new SubregionsController();
    subregionsController.getById(req, res)
});
routes.post('/', validateRequestBody(addSubregionsValidator), (req: any, res: any) => {
    const subregionsController = new SubregionsController();
    subregionsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateSubregionsValidator), (req: any, res: any) => {
    const subregionsController = new SubregionsController();
    subregionsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const subregionsController = new SubregionsController();
    subregionsController.delete(req, res)
});


export const router = routes;