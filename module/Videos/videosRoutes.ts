import express from "express";
import {AdminAuthMiddleware, AuthMiddleware, UserAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {VideosController} from "./videosController";
import  requireUser from "../../controllers/global/requiredUser";
import {
    addVideosValidator,
    updateVideosValidator,
    getAllVideosValidator
} from "./videosValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";

// const videosController = new VideosController(); // Create an instance of Controller

routes.use(requireUser);

routes.get('/', validateRequestParams(getAllVideosValidator), (req: any, res: any) => {
    const videosController = new VideosController();
    videosController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const videosController = new VideosController();
    videosController.getById(req, res)
});
routes.post('/', validateRequestBody(addVideosValidator), (req: any, res: any) => {
    const videosController = new VideosController();
    videosController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateVideosValidator), (req: any, res: any) => {
    const videosController = new VideosController();
    videosController.update(req, res)
});
routes.delete('/:id', (req: any, res: any) => {
    const videosController = new VideosController();
    videosController.delete(req, res)
});


export const router = routes;