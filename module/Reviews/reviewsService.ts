import { ReviewsModel} from './reviewsModel';
import {BaseService} from "../../services/api/baseService";

export class ReviewsService extends BaseService {
    constructor() {
        const reviewsModel = new ReviewsModel();
        super( reviewsModel);
    }
}