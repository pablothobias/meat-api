import * as restify from 'restify';
import * as jwt from 'jsonwebtoken'
import { NotAuthorizedError } from 'restify-errors';
import { User } from '../users/user.model';
import { environment } from '../common/environment';

export const authenticate: restify.RequestHandler = (req, resp, next) => {

    const { email, password } = req.body;

    User.findByEmail(email, '+password') // indica ao mongoose para trazer o password que nao vinha
        .then(user => {
            if (user && user.matches(password)) {
                //gerar o token
                const token = jwt.sign({
                    sub: user.email,
                    iss: 'meat-api'
                }, environment.security.apiSecret);

                resp.json({ name: user.name, email: user.email, accessToken: token });

                return next(false);
            } else {
                return next(new NotAuthorizedError('Invalid Credentials'));
            }
        }).catch(next);
};