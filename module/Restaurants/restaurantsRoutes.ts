import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {RestaurantsController} from "./restaurantsController";
import {
    addRestaurantsValidator,
    updateRestaurantsValidator,
    getAllRestaurantsValidator
} from "./restaurantsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const restaurantsController = new RestaurantsController(); // Create an instance of Controller

routes.use(requireUser);

routes.get('/', (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.getById(req, res)
});
routes.post('/', validateRequestBody(addRestaurantsValidator), (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateRestaurantsValidator), (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const restaurantsController = new RestaurantsController();
    restaurantsController.delete(req, res)
});


export const router = routes;