import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {UserRestaurantSuggestionsController} from "./userrestaurantsuggestionsController";
import {
    addUserRestaurantSuggestionsValidator,
    updateUserRestaurantSuggestionsValidator,
    getAllUserRestaurantSuggestionsValidator
} from "./userRestaurantSuggestionsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";

// const userrestaurantsuggestionsController = new UserRestaurantSuggestionsController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllUserRestaurantSuggestionsValidator), (req: any, res: any) => {
    const userrestaurantsuggestionsController = new UserRestaurantSuggestionsController();
    userrestaurantsuggestionsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const userrestaurantsuggestionsController = new UserRestaurantSuggestionsController();
    userrestaurantsuggestionsController.getById(req, res)
});
routes.post('/', validateRequestBody(addUserRestaurantSuggestionsValidator), (req: any, res: any) => {
    const userrestaurantsuggestionsController = new UserRestaurantSuggestionsController();
    userrestaurantsuggestionsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateUserRestaurantSuggestionsValidator), (req: any, res: any) => {
    const userrestaurantsuggestionsController = new UserRestaurantSuggestionsController();
    userrestaurantsuggestionsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const userrestaurantsuggestionsController = new UserRestaurantSuggestionsController();
    userrestaurantsuggestionsController.delete(req, res)
});


export const router = routes;