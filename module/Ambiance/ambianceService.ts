import { AmbianceModel} from './ambianceModel';
import {BaseService} from "../../services/api/baseService";

export class AmbianceService extends BaseService {
    constructor() {
        const ambianceModel = new AmbianceModel();
        super( ambianceModel);
    }
}