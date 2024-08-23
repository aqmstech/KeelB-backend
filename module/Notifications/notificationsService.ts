import { NotificationsModel} from './notificationsModel';
import {BaseService} from "../../services/api/baseService";
import {DEFAULT_ORDER, PAGE, PER_PAGE} from "../../utils/constants";
import {Utils} from "../../utils/utils";
import { NotificationTopicPayloadCustom } from '../_Services/Notification_Service/notificationInterface';
import {Notification} from '../_Services/Notification_Service/notification'
import { ObjectId } from 'mongodb';
import {AuthModel} from "../_Auth/authModel";
import UserRoles from "../../utils/enums/userRoles";

export class NotificationsService extends BaseService {
    private authModel: AuthModel
    constructor() {
        const notificationsModel = new NotificationsModel();
        super( notificationsModel);
        this.authModel = new AuthModel()
    }

    protected async getAll(order = DEFAULT_ORDER, param: any = {}, filter = {}) {
        try {
            const page = param.page ? parseInt(param.page) : PAGE
            const perPage = param.per_page ? parseInt(param.per_page) : PER_PAGE
            const withoutPagination = param.withoutPagination ? true : false
            const records: [] = await this.model.List(filter, order, page, perPage, withoutPagination);
            return Utils.getResponse(true, "Record fetched successfully", records, 200, 1000);
        } catch (error) {
            return Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
        }
    }

    protected async markAllRead(_id: object, data: any = {}) {
        try {
            await this.model.UpdateMany({receiver_id:_id}, data);
            return Utils.getResponse(true, "All notifications has been marked as read successfully", null, 200, 1002);

        } catch (error) {
            console.log(error,"error")
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    }

    protected async create(req: any = {}) {
        try {
            let data =req.body
            data['createdAt'] = new Date().toString();
            const sanitizeData = this.model.sanitize(data)
            let  inserteedId :any = null
            let record: any = null
            let notification_payload : NotificationTopicPayloadCustom = {
                topic:sanitizeData.topic,
                title:sanitizeData.title,
                body:sanitizeData.body,
                data:{
                    ref_id: sanitizeData.ref_id || null,
                    url:'',
                    type:sanitizeData.topic
                }
            }
            if(sanitizeData.sender_id != undefined || sanitizeData.sender_id != null){
                sanitizeData.sender_id=new ObjectId(sanitizeData.sender_id)
            }else{
                sanitizeData.sender_id=new ObjectId(req?.auth?._id)
            }


            if(sanitizeData.ref_id != undefined || sanitizeData.ref_id != null){
                sanitizeData.ref_id=new ObjectId(sanitizeData.ref_id)
            }

            if(sanitizeData.receiver_id != undefined || sanitizeData.receiver_id != null){
                sanitizeData.receiver_id=new ObjectId(sanitizeData.receiver_id)
                inserteedId = await this.model.Add(sanitizeData)
            }else{
                sanitizeData.receiver_id=new ObjectId(req?.auth?._id)
                inserteedId = await this.model.Add(sanitizeData)
                let users = await this.authModel.List({deletedAt:null},DEFAULT_ORDER,0,0,true)

                if(users?.length > 0){
                    let data:any = []
                    data = users.map((item:any)=>({
                        title: sanitizeData?.title,
                        body:sanitizeData?.body,
                        sender_id: new ObjectId(req.auth._id),
                        receiver_id: item._id,
                        topic: sanitizeData.topic,
                        ref_id: null,
                        is_read: false,
                        status: true,
                        type: UserRoles.USER,
                        createdAt: new Date(),
                        updatedAt: null,
                        deletedAt: null
                    }))
                    this.model.CreateMany(data)
                }


            }

            Notification.sendNotificationTopicCustom(notification_payload)



            if(inserteedId){
                record = await this.model.GetById(inserteedId);
            }


            return Utils.getResponse(true, "Record has been added successfully", record, 200, 1001);
        } catch (error) {
            console.log(error, 'error in service add')
            return Utils.getResponse(false, "Something went wrong", null, 500, 1005);
        }
    };

}