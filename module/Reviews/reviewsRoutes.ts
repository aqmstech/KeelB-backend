import express from "express";
import {AdminAuthMiddleware} from '../../middlewares/api/auth';

const routes = express.Router();
import {ReviewsController} from "./reviewsController";
import {
    addReviewsValidator,
    updateReviewsValidator,
    getAllReviewsValidator
} from "./reviewsValidator";

import {validateRequestBody, validateRequestParams} from "../../utils/validator/ValidateRequest";
import requireUser from "../../controllers/global/requiredUser";

// const reviewsController = new ReviewsController(); // Create an instance of Controller

routes.use(requireUser);

routes.get('/', validateRequestParams(getAllReviewsValidator), (req: any, res: any) => {
    const reviewsController = new ReviewsController();
    reviewsController.getAll(req, res)
});
routes.get('/:id', (req: any, res: any) => {
    const reviewsController = new ReviewsController();
    reviewsController.getById(req, res)
});
routes.post('/', validateRequestBody(addReviewsValidator), (req: any, res: any) => {
    const reviewsController = new ReviewsController();
    reviewsController.create(req, res)
});
routes.put('/:id', validateRequestBody(updateReviewsValidator), (req: any, res: any) => {
    const reviewsController = new ReviewsController();
    reviewsController.update(req, res)
});
routes.patch('/patch/:id', (req: any, res: any) => {
    const reviewsController = new ReviewsController();
    reviewsController.update(req, res)
});

routes.delete('/:id', (req: any, res: any) => {
    const reviewsController = new ReviewsController();
    reviewsController.delete(req, res)
});


export const router = routes;