import express from "express";
import { AdminAuthMiddleware } from '../../middlewares/api/auth';

const routes = express.Router();
import { FaqsController } from "./faqsController";
import {
    addFaqsValidator,
    updateFaqsValidator,
    getAllFaqsValidator
} from "./faqsValidator";

import { validateRequestBody, validateRequestParams } from "../../utils/validator/ValidateRequest";

// const faqsController = new FaqsController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllFaqsValidator), (req: any, res: any) => {
    const faqsController = new FaqsController();
    faqsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const faqsController = new FaqsController();
    faqsController.getById(req, res)
});
routes.post('/', validateRequestBody(addFaqsValidator), (req: any, res: any) => {
    const faqsController = new FaqsController();
    faqsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateFaqsValidator), (req: any, res: any) => {
    const faqsController = new FaqsController();
    faqsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const faqsController = new FaqsController();
    faqsController.delete(req, res)
});


export const router = routes;