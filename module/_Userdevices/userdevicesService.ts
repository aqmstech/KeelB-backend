import { UserdevicesModel } from './userdevicesModel';
import { BaseService } from "../../services/api/baseService";
import { Utils } from '../../utils/utils';
import { ObjectId } from 'mongodb';

export class UserdevicesService extends BaseService {
    private userdevicesModel: UserdevicesModel
    constructor() {
        const userdevicesModel = new UserdevicesModel();
        super(userdevicesModel);
        this.userdevicesModel = userdevicesModel
    }

    async getDevicesOfUsers(req: any, res: any) {
        try {
            let { userId: userIds } = req.body
            userIds = userIds.map((userId: string) => new ObjectId(userId));
            const userDevices = await this.userdevicesModel.getDevicesByUserIds(userIds)
            let response: any = Utils.getResponse(true, "Data fetched successfully", userDevices, 200);
            return res.status(200).send(response);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }
}