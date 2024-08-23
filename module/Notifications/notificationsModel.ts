import {BaseModel} from "../../models/baseModel";
import {NotificationsInterface} from "./notificationsInterface";
import {Utils} from "../../utils/utils";

export class NotificationsModel extends BaseModel {
    protected fillables: any = [];

    constructor() {
        super('notifications', []);
        this.fillables = [
            {
                "column": "title",
                "type": "string"
            },
            {
                "column": "body",
                "type": "string"
            },
            {
                "column": "sender_id",
                "type": "string"
            },
            {
                "column": "receiver_id",
                "type": "string"
            },
            {
                "column": "topic",
                "type": "string"
            },
            {
                "column": "ref_id",
                "type": "string"
            },
            {
                "column": "is_read?",
                "type": "boolean"
            },
            {
                "column": "status?",
                "type": "boolean"
            },
            {
                "column": "type",
                "type": "number"
            },
            {
                "column": "createdAt",
                "type": "date"
            },
            {
                "column": "updatedAt?",
                "type": "date"
            },
            {
                "column": "deletedAt?",
                "type": "date"
            }
        ]
    }

    public sanitize(data: any): NotificationsInterface {
        const keys = Object.keys(data);
        const columns = this.fillables.map((column: any) => column.column);
        let newData: any = {}
        // Check if all the required keys are present in the data
        for (const key of columns) {
            if (keys.includes(key)) {
                newData[key] = data[key];
            }
        }

        return newData as NotificationsInterface;
    }

    public async List(filter: any, order: {}, page: number, perPage: number, withoutPagination: boolean = false) {
        if (!this.collection) await this.INIT()
        try {

            filter.deletedAt = null;

            // Lookup stage to join with the user table
            const lookupPipeline: any = [
                {
                    $lookup: {
                        from: 'videos', // Assuming the name of the user collection is 'user'
                        localField: 'ref_id', // Local field in the current collection
                        foreignField: '_id', // Foreign field in the user collection
                        pipeline: [
                            {$project: {otpInfo: 0, password: 0}},
                        ],
                        as: 'ref_data',// Alias for the joined user data,

                    },

                },
                {$unwind: {path: "$ref_data", preserveNullAndEmptyArrays: true}}
            ];


            let aggregationPipeline = [{$match: filter}, ...lookupPipeline];

            const totalUnread: any = await this.collection.countDocuments({
                receiver_id: filter.receiver_id,
                is_read: false
            });

            if (withoutPagination) {
                // Execute aggregation without pagination
                const data = await this.collection.aggregate(aggregationPipeline).sort(order).toArray();
                return {
                    data: data,
                    unread_count: totalUnread
                };
            }

            // Calculate pagination and total count
            let pagination: any = Utils.CalcPagination(page, perPage);
            const total: any = await this.collection.countDocuments(filter);

            // Execute aggregation with pagination
            aggregationPipeline = [...aggregationPipeline, {$sort: order}, {$skip: pagination.skip}, {$limit: pagination.limit}];
            const data = await this.collection.aggregate(aggregationPipeline).toArray();
            return Utils.CustomPagination(data, page, perPage, parseInt(total), this?.collectionName || 'data', {unread_count: totalUnread});

        } catch (error: any) {
            console.log(error);
            throw new Error(error);
        }
    }
}