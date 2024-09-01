import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {MealTypesController} from "./mealtypesController";

import {
    addMealTypesValidator,
    updateMealTypesValidator,
    getAllMealTypesValidator
} from "./mealtypesValidator";
import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const mealtypesController = new MealTypesController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllMealTypesValidator), (req: any, res: any) => {
    const mealtypesController = new MealTypesController();
    mealtypesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const mealtypesController = new MealTypesController();
    mealtypesController.getById(req, res)
});
routes.post('/',requireUser, validateRequestBody(addMealTypesValidator), (req: any, res: any) => {
    const mealtypesController = new MealTypesController();
    mealtypesController.create(req, res)
});
routes.put('/:id',requireUser, validateRequestBody(updateMealTypesValidator), (req: any, res: any) => {
    const mealtypesController = new MealTypesController();
    mealtypesController.update(req, res)
});
routes.delete('/:id', requireUser,(req: any, res: any) => {
    const mealtypesController = new MealTypesController();
    mealtypesController.delete(req, res)
});


export const router = routes;