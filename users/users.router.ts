// Rota do users da aplicacao que no retorna todos os usuarios

import { Router } from '../common/router';
import * as restify from 'restify';
import { User } from './user.model';
import { response } from 'spdy';

class UsersRouter extends Router {

    applyRoutes(application: restify.Server) {

        application.get('/users', (req, resp, next) => {

            User.find().then((users) => {

                resp.json(users);
                return next();
            });
        });

        application.get('users/:id', (req, resp, next) => {

            User.findById(req.params.id).then(user => {

                if (user) {

                    resp.json(user);
                    next();
                }

                resp.send(404);
                next();
            });

        });

        application.post('/users', (req, res, next) => {

            let user = new User(req.body);
            user.save().then(user => {

                user.password = undefined;
                res.json(user);
                next();
            });
        });
    }
}

export const usersRouter = new UsersRouter();