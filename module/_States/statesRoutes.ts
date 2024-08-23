import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { StatesController } from "./statesController";
import {
    addStatesValidator,
    updateStatesValidator,
    getAllStatesValidator
} from "./statesValidator";

import { validateRequestBody, validateRequestParams } from "../../utils/validator/ValidateRequest";

// const statesController = new StatesController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllStatesValidator), (req: any, res: any) => {
    const statesController = new StatesController();
    statesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const statesController = new StatesController();
    statesController.getById(req, res)
});
routes.post('/', validateRequestBody(addStatesValidator), (req: any, res: any) => {
    const statesController = new StatesController();
    statesController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateStatesValidator), (req: any, res: any) => {
    const statesController = new StatesController();
    statesController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const statesController = new StatesController();
    statesController.delete(req, res)
});


export const router = routes;