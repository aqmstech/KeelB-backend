import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../utils/constants';

export const AuthOptionalMiddleware = (req: any, res:any, next:any) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if(token){
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.auth = decoded;
        } catch (error) {
            res.status(400).send({error: 'Invalid token'});
        }
    }
    next();
}