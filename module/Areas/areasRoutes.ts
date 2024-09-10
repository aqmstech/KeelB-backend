import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {AreasController} from "./areasController";
import {
    addAreasValidator,
    updateAreasValidator,
    getAllAreasValidator
} from "./areasValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const areasController = new AreasController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllAreasValidator), (req: any, res: any) => {
    const areasController = new AreasController();
    areasController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const areasController = new AreasController();
    areasController.getById(req, res)
});
routes.post('/',requireUser,  validateRequestBody(addAreasValidator), (req: any, res: any) => {
    const areasController = new AreasController();
    areasController.create(req, res)
});
routes.put('/:id',requireUser,  validateRequestBody(updateAreasValidator), (req: any, res: any) => {
    const areasController = new AreasController();
    areasController.update(req, res)
});
routes.delete('/:id',requireUser,  (req: any, res: any) => {
    const areasController = new AreasController();
    areasController.delete(req, res)
});


export const router = routes;