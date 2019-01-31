"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = (req, resp, err, done) => {
    err.toJSON = () => {
        return {
            message: err.message
        };
    };
    switch (err.name) {
        //erro de chave duplicada
        case 'MongoError':
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
        //erro de validacao do cliente
        case 'validationError':
            err.statusCode = 400;
            break;
    }
    done();
};
