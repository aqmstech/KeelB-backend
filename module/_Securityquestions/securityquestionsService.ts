import { SecurityquestionsModel} from './securityquestionsModel';
import {BaseService} from "../../services/api/baseService";

export class SecurityquestionsService extends BaseService {
    constructor() {
        const securityquestionsModel = new SecurityquestionsModel();
        super( securityquestionsModel);
    }
}