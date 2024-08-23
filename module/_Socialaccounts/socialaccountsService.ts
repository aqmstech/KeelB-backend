import { SocialaccountsModel} from './socialaccountsModel';
import {BaseService} from "../../services/api/baseService";

export class SocialaccountsService extends BaseService {
    constructor() {
        const socialaccountsModel = new SocialaccountsModel();
        super( socialaccountsModel);
    }
}