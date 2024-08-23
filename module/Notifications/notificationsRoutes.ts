import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';
const routes = express.Router();
import {NotificationsController} from "./notificationsController";
import {
    addNotificationsValidator,
    updateNotificationsValidator,
    getAllNotificationsValidator
} from "./notificationsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const notificationsController = new NotificationsController(); // Create an instance of Controller

routes.use(requireUser);

routes.get('/', validateRequestParams(getAllNotificationsValidator), (req: any, res: any) => {
    const notificationsController = new NotificationsController();
    notificationsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const notificationsController = new NotificationsController();
    notificationsController.getById(req, res)
});
routes.post('/', validateRequestBody(addNotificationsValidator), (req: any, res: any) => {
    const notificationsController = new NotificationsController();
    notificationsController.create(req, res)
});

routes.post('/mark-read', (req: any, res: any) => {
    const notificationsController = new NotificationsController();
    notificationsController.markAllRead(req, res)
});
routes.put('/:id', validateRequestBody(updateNotificationsValidator), (req: any, res: any) => {
    const notificationsController = new NotificationsController();
    notificationsController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const notificationsController = new NotificationsController();
    notificationsController.delete(req, res)
});


export const router = routes;