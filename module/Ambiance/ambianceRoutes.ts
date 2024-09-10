import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {AmbianceController} from "./ambianceController";
import {
    addAmbianceValidator,
    updateAmbianceValidator,
    getAllAmbianceValidator
} from "./ambianceValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const ambianceController = new AmbianceController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllAmbianceValidator), (req: any, res: any) => {
    const ambianceController = new AmbianceController();
    ambianceController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const ambianceController = new AmbianceController();
    ambianceController.getById(req, res)
});
routes.post('/',requireUser, validateRequestBody(addAmbianceValidator), (req: any, res: any) => {
    const ambianceController = new AmbianceController();
    ambianceController.create(req, res)
});
routes.put('/:id',requireUser, validateRequestBody(updateAmbianceValidator), (req: any, res: any) => {
    const ambianceController = new AmbianceController();
    ambianceController.update(req, res)
});
routes.delete('/:id',requireUser, (req: any, res: any) => {
    const ambianceController = new AmbianceController();
    ambianceController.delete(req, res)
});


export const router = routes;