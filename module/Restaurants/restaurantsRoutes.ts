import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {RestaurantsController} from "./restaurantsController";
import {
    addRestaurantsValidator,
    updateRestaurantsValidator,
    getAllRestaurantsValidator,
    updateRestaurantsStatusValidator
} from "./restaurantsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const restaurantsController = new RestaurantsController(); // Create an instance of Controller

routes.get('/',requireUser,validateRequestBody(getAllRestaurantsValidator), (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.getAll(req, res)
});
routes.get('/:id', requireUser,(req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.getById(req, res)
});
routes.post('/',requireUser, validateRequestBody(addRestaurantsValidator), (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.create(req, res)
});
routes.put('/:id',requireUser, validateRequestBody(updateRestaurantsValidator), (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.update(req, res)
});

routes.patch('/update-status/:id',requireUser,validateRequestBody(updateRestaurantsStatusValidator), (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.updateStatus(req, res)
});

routes.patch('/:id',requireUser, (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.update(req, res)
});

routes.delete('/:id',requireUser, (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.delete(req, res)
});


export const router = routes;