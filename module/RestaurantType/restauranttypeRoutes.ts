import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {RestaurantTypeController} from "./restauranttypeController";
import {
    addRestaurantTypeValidator,
    updateRestaurantTypeValidator,
    getAllRestaurantTypeValidator
} from "./restauranttypeValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";
// const restauranttypeController = new RestaurantTypeController(); // Create an instance of Controller

// routes.use(requireUser);

routes.get('/', validateRequestParams(getAllRestaurantTypeValidator), (req: any, res: any) => {
    const restauranttypeController = new RestaurantTypeController();
    restauranttypeController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const restauranttypeController = new RestaurantTypeController();
    restauranttypeController.getById(req, res)
});
routes.post('/',requireUser, validateRequestBody(addRestaurantTypeValidator), (req: any, res: any) => {
    const restauranttypeController = new RestaurantTypeController();
    restauranttypeController.create(req, res)
});
routes.put('/:id',requireUser,  validateRequestBody(updateRestaurantTypeValidator), (req: any, res: any) => {
    const restauranttypeController = new RestaurantTypeController();
    restauranttypeController.update(req, res)
});
routes.delete('/:id',requireUser,  (req: any, res: any) => {
    const restauranttypeController = new RestaurantTypeController();
    restauranttypeController.delete(req, res)
});


export const router = routes;