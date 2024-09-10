import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {CategoriesController} from "./categoriesController";
import {
    addCategoriesValidator,
    updateCategoriesValidator,
    getAllCategoriesValidator
} from "./categoriesValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const categoriesController = new CategoriesController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllCategoriesValidator), (req: any, res: any) => {
    const categoriesController = new CategoriesController();
    categoriesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const categoriesController = new CategoriesController();
    categoriesController.getById(req, res)
});
routes.post('/',requireUser, validateRequestBody(addCategoriesValidator), (req: any, res: any) => {
    const categoriesController = new CategoriesController();
    categoriesController.create(req, res)
});
routes.put('/:id',requireUser, validateRequestBody(updateCategoriesValidator), (req: any, res: any) => {
    const categoriesController = new CategoriesController();
    categoriesController.update(req, res)
});
routes.delete('/:id',requireUser, (req: any, res: any) => {
    const categoriesController = new CategoriesController();
    categoriesController.delete(req, res)
});


export const router = routes;