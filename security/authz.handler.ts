import * as restify from 'restify';
import { ForbiddenError } from 'restify-errors';

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
    return (req, resp, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            next();
        } else {
            if(req.authenticated) req.log.debug('')
            next(new ForbiddenError('Permission denied'));
        }
    }
}
