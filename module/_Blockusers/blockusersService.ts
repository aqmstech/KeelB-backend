import { BlockusersModel } from './blockusersModel';
import { BaseService } from "../../services/api/baseService";
import { ObjectId } from 'mongodb';
import { Utils } from '../../utils/utils';
import { BlockusersInterface } from './blockusersInterface';
import { Request, Response } from 'express';

export class BlockusersService extends BaseService {
    private blockusersModel: BlockusersModel
    constructor() {
        const blockusersModel = new BlockusersModel();
        super(blockusersModel);
        this.blockusersModel = blockusersModel
    }

    async blockOrUnblockUser(req: Request, res: Response) {
        try {
            const { blockedUserId } = req.body
            let filter = {
                userId: new ObjectId(res.locals.currentUser._id),
                blockedId: new ObjectId(blockedUserId),
            };
            let alreadyBlocked: BlockusersInterface | null = await this.blockusersModel.GetOne(filter);
            if (alreadyBlocked) {
                // unblock the user
                await this.blockusersModel.removeBlockUser(filter);
                let response: any = Utils.getResponse(true, "User unblocked successfully", {}, 200);
                return res.status(200).send(response);
            } else {
                // blocked the user
                const userBlocked: BlockusersInterface = await this.blockusersModel.Add({
                    userId: new ObjectId(res.locals.currentUser._id),
                    blockedId: new ObjectId(blockedUserId),
                    createdAt: new Date()
                });
                let response: any = Utils.getResponse(true, "User blocked successfully", {}, 200);
                return res.status(200).send(response);
            }
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }

    async blockUsersList(req: Request, res: Response) {
        try {

            let query: any = req.query;
            const page: number = parseInt(query.page) || 1;
            const limit: number = parseInt(query.per_page) || 10;
            const skip: number = (page - 1) * limit;

            let pipeline = [
                {
                    $match: {
                        userId: new ObjectId(res.locals.currentUser._id),
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        let: { blockedId: "$blockedId" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", { $toObjectId: "$$blockedId" }],
                                    },
                                },
                            },
                        ],
                        as: "blockedId",
                    },
                },
                {
                    $unwind: "$blockedId",
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        blockedId: {
                            _id: 1,
                            firstName: 1,
                            lastName: 1,
                            email: 1,
                            fullName: 1,
                            profileImage: 1,
                            coverImage: 1,
                            additionalFields: 1,
                            createdAt: 1,
                        },
                        createdAt: 1,
                    },
                },
            ];
            let blockList: any = await this.blockusersModel.findWithAggregate(pipeline);

            const totalCount: number = await this.blockusersModel.Count({
                userId: new ObjectId(res.locals.currentUser._id),
            })

            const total: number = totalCount;
            const totalPages: number = Math.ceil(total / limit);
            const currentPage: number = page;
            const firstPage: number = 1;
            const lastPage: number = totalPages;

            const pagination = {
                currentPage,
                perPage: limit,
                total,
                lastPage,
                firstPage,
            };

            let response: any = Utils.getResponse(true, "Data fetched successfully", { blockList, pagination }, 200);
            return res.status(200).send(response);
        } catch (error) {
            console.log(error)
            const errorResponse = Utils.getResponse(false, "Something went wrong", error || {}, 500, 1005);
            return res.status(errorResponse.status_code).send(errorResponse.body);
        }
    }
}