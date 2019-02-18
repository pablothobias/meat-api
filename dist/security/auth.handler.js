"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const restify_errors_1 = require("restify-errors");
const user_model_1 = require("../users/user.model");
const environment_1 = require("../common/environment");
exports.authenticate = (req, resp, next) => {
    const { email, password } = req.body;
    user_model_1.User.findByEmail(email, '+password') // indica ao mongoose para trazer o password que nao vinha
        .then(user => {
        if (user && user.matches(password)) {
            //gerar o token
            const token = jwt.sign({
                sub: user.email,
                iss: 'meat-api'
            }, environment_1.environment.security.apiSecret);
            resp.json({ name: user.name, email: user.email, accessToken: token });
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid Credentials'));
        }
    }).catch(next);
};
