import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/constants';
// import {RoleModel} from "../../models/roleModel";
import UserTypes from '../../utils/enums/userTypes';
import { Utils } from '../../utils/utils';

export const AuthMiddleware = (req: any, res:any, next:any) => {
    console.log("decoded")
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        const result = Utils.getResponse(false, "Access denied. No token provided", null, 401);
        return res.status(result.status_code).send(result.body);
    }
    try {
        const decoded:any = jwt.verify(token, JWT_SECRET);

        if(decoded && (decoded.type==UserTypes.RESTAURANT || decoded.type==UserTypes.USER)){
            req.auth = decoded;
            next();
        }else{
            const result = Utils.getResponse(false, "Invalid token", null, 401);
            return res.status(result.status_code).send(result.body);
        }
    } catch (error) {
        console.log(error,'error')
        const result = Utils.getResponse(false, "Invalid token", null, 401);
        return res.status(result.status_code).send(result.body);
    }
}

export const UserAuthMiddleware = (req: any, res:any, next:any) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        const result = Utils.getResponse(false, "Access denied. No token provided", null, 401);
        return res.status(result.status_code).send(result.body);
    }
    try {
        const decoded:any = jwt.verify(token, JWT_SECRET);
        if(decoded && (decoded.type==UserTypes.USER)){
            req.auth = decoded;
            next();
        }else{
            const result = Utils.getResponse(false, "Invalid token", null, 401);
            return res.status(result.status_code).send(result.body);
        }
    } catch (error) {
        const result = Utils.getResponse(false, "Invalid token", null, 401);
        return res.status(result.status_code).send(result.body);
    }
}

export const RestaurantAuthMiddleware = (req: any, res:any, next:any) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        const result = Utils.getResponse(false, "Access denied. No token provided", null, 401);
        return res.status(result.status_code).send(result.body);
    }
    try {
        const decoded:any = jwt.verify(token, JWT_SECRET );
        if(decoded && (decoded.type==UserTypes.RESTAURANT)){
            req.auth = decoded;
            next();
        }else{
            const result = Utils.getResponse(false, "Invalid token", null, 401);
            return res.status(result.status_code).send(result.body);
        }
    } catch (error) {
        const result = Utils.getResponse(false, "Invalid token", null, 401);
        return res.status(result.status_code).send(result.body);
    }
}

export const AdminAuthMiddleware = async (req: any, res:any, next:any) => {
    const baseUrlWithoutApiV1 = req.baseUrl.replace('/api/v1', '');

    const endpoint = baseUrlWithoutApiV1+req.url;

    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
        const result = Utils.getResponse(false, "Access denied. No token provided", null, 401);
        return res.status(result.status_code).send(result.body);
    }
    try {
        const decoded:any = jwt.verify(token, JWT_SECRET);
        if( decoded && decoded.type==UserTypes.ADMIN){
            // const role:any = await RoleModel.GetRoleByID( decoded.role_id);
            // console.log(role)
            // const hasAccess = role.rights.some((right: any) => right.url === endpoint);
            // console.log(hasAccess)
            req.auth = decoded;
            next();
        } else{
            const result = Utils.getResponse(false, "Invalid token", null, 401);
            return res.status(result.status_code).send(result.body);
        }
    } catch (error) {
        const result = Utils.getResponse(false, "Invalid token", null, 401);
        return res.status(result.status_code).send(result.body);
    }
}