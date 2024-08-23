import { VideosModel} from './videosModel';
import {BaseService} from "../../services/api/baseService";
import {Utils} from "../../utils/utils";
import {Notification} from '../_Services/Notification_Service/notification'
import {NotificationTopicPayloadCustom} from "../_Services/Notification_Service/notificationInterface";
import {NotificationsModel} from "../Notifications/notificationsModel";
import {AuthModel} from "../_Auth/authModel";
import { ObjectId } from 'mongodb';
import {DEFAULT_ORDER} from "../../utils/constants";
import UserRoles from "../../utils/enums/userRoles";

export class VideosService extends BaseService {
    private notificationsModel: NotificationsModel
    private authModel: AuthModel
    constructor() {
        const videosModel = new VideosModel();
        super( videosModel);
        this.notificationsModel = new NotificationsModel()
        this.authModel = new AuthModel()
    }

     async create(req: any = {}) {
        try {
            let data = req.body
            data['createdAt'] = new Date().toString();
            if(data.is_feature){
               await this.model.findAllAndUpdateByQuery({ is_feature: true },{$set: { is_feature:false }})
            }

            const sanitizeData = this.model.sanitize(data)

            const inserteedId = await this.model.Add(sanitizeData)
            let record: any = await this.model.GetById(inserteedId);

            let notification_payload : NotificationTopicPayloadCustom = {
                 topic:'video',
                title:'New Video Alert!',
                 body:'Check out the new video updated, don\'t miss out & click here to watch it now.\n',
                data:{
                    ref_id: inserteedId?.toString(),
                    url:sanitizeData.url,
                    type:'video'
                }
            }
            let users = await this.authModel.List({deletedAt:null},DEFAULT_ORDER,0,0,true)

            if(users?.length > 0){
                let data:any = []
                data = users.map((item:any)=>({
                    title: 'New Video Alert!',
                    body: 'Check out the new video updated, don\'t miss out & click here to watch it now.\n',
                    sender_id: new ObjectId(req.auth._id),
                    receiver_id: item._id,
                    topic: 'video',
                    ref_id: inserteedId,
                    is_read: false,
                    status: true,
                    type:UserRoles.USER,
                    createdAt: new Date(),
                    updatedAt: null,
                    deletedAt: null
                }))
                  this.notificationsModel.CreateMany(data)
                  Notification.sendNotificationTopicCustom(notification_payload)
            }

            return Utils.getResponse(true, "Record has been added successfully", record, 200, 1001);
        } catch (error) {
            console.log(error, 'error in service add')
            return Utils.getResponse(false, "Something went wrong", error, 500, 1005);
        }
    };

}