import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {UserFavoritesController} from "./userfavoritesController";
import {
    addUserFavoritesValidator,
    updateUserFavoritesValidator,
    getAllUserFavoritesValidator
} from "./userfavoritesValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const userfavoritesController = new UserFavoritesController(); // Create an instance of Controller

routes.use(requireUser);

routes.get('/', validateRequestParams(getAllUserFavoritesValidator), (req: any, res: any) => {
    const userfavoritesController = new UserFavoritesController();
    userfavoritesController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const userfavoritesController = new UserFavoritesController();
    userfavoritesController.getById(req, res)
});
routes.post('/', validateRequestBody(addUserFavoritesValidator), (req: any, res: any) => {
    const userfavoritesController = new UserFavoritesController();
    userfavoritesController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateUserFavoritesValidator), (req: any, res: any) => {
    const userfavoritesController = new UserFavoritesController();
    userfavoritesController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const userfavoritesController = new UserFavoritesController();
    userfavoritesController.delete(req, res)
});


export const router = routes;