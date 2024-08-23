import { SamplesModel} from '../../models/samplesModel';
import {BaseService} from "./baseService";

export class SamplesService extends BaseService {
    constructor() {
        const samplesModel = new SamplesModel();
        super( samplesModel);
    }
}