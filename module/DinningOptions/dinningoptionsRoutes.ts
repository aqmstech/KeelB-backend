import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {DinningOptionsController} from "./dinningoptionsController";
import {
    addDinningOptionsValidator,
    updateDinningOptionsValidator,
    getAllDinningOptionsValidator
} from "./dinningoptionsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const dinningoptionsController = new DinningOptionsController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllDinningOptionsValidator), (req: any, res: any) => {
    const dinningoptionsController = new DinningOptionsController();
    dinningoptionsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const dinningoptionsController = new DinningOptionsController();
    dinningoptionsController.getById(req, res)
});
routes.post('/',requireUser,  validateRequestBody(addDinningOptionsValidator), (req: any, res: any) => {
    const dinningoptionsController = new DinningOptionsController();
    dinningoptionsController.create(req, res)
});
routes.put('/:id',requireUser,  validateRequestBody(updateDinningOptionsValidator), (req: any, res: any) => {
    const dinningoptionsController = new DinningOptionsController();
    dinningoptionsController.update(req, res)
});
routes.delete('/:id',requireUser,  (req: any, res: any) => {
    const dinningoptionsController = new DinningOptionsController();
    dinningoptionsController.delete(req, res)
});


export const router = routes;