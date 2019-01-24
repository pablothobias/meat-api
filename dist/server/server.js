"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const environment_1 = require("../common/environment");
class Server {
    initRoutes() {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.use(restify.plugins.queryParser());
                // ===routes===:
                this.application.get('/info', [(req, resp, next) => {
                        if (req.userAgent() && req.userAgent().includes('MSIE 7.0')) {
                            // resp.status(400);
                            // resp.json({message: 'atualize seu navegador'});
                            // return next(false);
                            let error = new Error();
                            error.statusCode = 400;
                            error.message = 'atualize seu navegador';
                            return next(error);
                        }
                        return next();
                    },
                    (req, resp, next) => {
                        // resp.contentType = 'application/json'; set response para json
                        // resp.setHeader('Content-Type','application/json'); modo mais tradicional de se setar o header
                        // resp.send({message: 'hello'}); enviar a response, consegue identificar o tipo da responsta automaticamente
                        // resp.status(400); set o status da response nesse caso para erro
                        resp.json({
                            browser: req.userAgent(),
                            method: req.method,
                            url: req.href(),
                            path: req.path(),
                            query: req.query,
                        });
                        return next();
                    }]);
                // ===fim das rotas===
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap() {
        return this.initRoutes().then(() => this);
    }
}
exports.Server = Server;
