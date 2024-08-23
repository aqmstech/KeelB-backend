import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {SocialaccountsController} from "./socialaccountsController";
import {
    addSocialaccountsValidator,
    updateSocialaccountsValidator,
    getAllSocialaccountsValidator
} from "./socialaccountsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";

// const socialaccountsController = new SocialaccountsController(); // Create an instance of Controller

// routes.use(AdminAuthMiddleware);

routes.get('/', validateRequestParams(getAllSocialaccountsValidator), (req: any, res: any) => {
    const socialaccountsController = new SocialaccountsController();
    socialaccountsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const socialaccountsController = new SocialaccountsController();
    socialaccountsController.getById(req, res)
});
routes.post('/', validateRequestBody(addSocialaccountsValidator), (req: any, res: any) => {
    const socialaccountsController = new SocialaccountsController();
    socialaccountsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateSocialaccountsValidator), (req: any, res: any) => {
    const socialaccountsController = new SocialaccountsController();
    socialaccountsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const socialaccountsController = new SocialaccountsController();
    socialaccountsController.delete(req, res)
});


export const router = routes;