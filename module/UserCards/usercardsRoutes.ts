import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {UserCardsController} from "./usercardsController";
import {
    addUserCardsValidator,
    updateUserCardsValidator,
    getAllUserCardsValidator
} from "./usercardsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const usercardsController = new UserCardsController(); // Create an instance of Controller

routes.use(requireUser);

routes.get('/', validateRequestParams(getAllUserCardsValidator), (req: any, res: any) => {
    const usercardsController = new UserCardsController();
    usercardsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const usercardsController = new UserCardsController();
    usercardsController.getById(req, res)
});
routes.post('/', validateRequestBody(addUserCardsValidator), (req: any, res: any) => {
    const usercardsController = new UserCardsController();
    usercardsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateUserCardsValidator), (req: any, res: any) => {
    const usercardsController = new UserCardsController();
    usercardsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const usercardsController = new UserCardsController();
    usercardsController.delete(req, res)
});


export const router = routes;