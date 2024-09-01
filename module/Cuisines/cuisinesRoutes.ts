import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {CuisinesController} from "./cuisinesController";
import {
    addCuisinesValidator,
    updateCuisinesValidator,
    getAllCuisinesValidator
} from "./cuisinesValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const cuisinesController = new CuisinesController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllCuisinesValidator), (req: any, res: any) => {
    const cuisinesController = new CuisinesController();
    cuisinesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const cuisinesController = new CuisinesController();
    cuisinesController.getById(req, res)
});
routes.post('/',requireUser, validateRequestBody(addCuisinesValidator), (req: any, res: any) => {
    const cuisinesController = new CuisinesController();
    cuisinesController.create(req, res)
});
routes.put('/:id',requireUser, validateRequestBody(updateCuisinesValidator), (req: any, res: any) => {
    const cuisinesController = new CuisinesController();
    cuisinesController.update(req, res)
});
routes.delete('/:id',requireUser, (req: any, res: any) => {
    const cuisinesController = new CuisinesController();
    cuisinesController.delete(req, res)
});


export const router = routes;