import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {SecurityquestionsController} from "./securityquestionsController";
import {
    addSecurityquestionsValidator,
    updateSecurityquestionsValidator,
    getAllSecurityquestionsValidator
} from "./securityquestionsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";

// const securityquestionsController = new SecurityquestionsController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllSecurityquestionsValidator), (req: any, res: any) => {
    const securityquestionsController = new SecurityquestionsController();
    securityquestionsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const securityquestionsController = new SecurityquestionsController();
    securityquestionsController.getById(req, res)
});
routes.post('/', validateRequestBody(addSecurityquestionsValidator), (req: any, res: any) => {
    const securityquestionsController = new SecurityquestionsController();
    securityquestionsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateSecurityquestionsValidator), (req: any, res: any) => {
    const securityquestionsController = new SecurityquestionsController();
    securityquestionsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const securityquestionsController = new SecurityquestionsController();
    securityquestionsController.delete(req, res)
});


export const router = routes;