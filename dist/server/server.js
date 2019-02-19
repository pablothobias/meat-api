"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const restify = require("restify");
const mongoose = require("mongoose");
const environment_1 = require("../common/environment");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
const token_parser_1 = require("../security/token.parser");
class Server {
    initializeDb() {
        //para usar a promise no mongoose
        mongoose.Promise = global.Promise;
        //url da constante do banco  e opcoes de conxoes mongoose
        return mongoose.connect(environment_1.environment.db.url, {
            useMongoClient: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            const options = {
                name: 'meat-api',
                version: '1.0.0',
            };
            if (environment_1.environment.security.enableHTTPS) {
                options.certificate = fs.readFileSync(environment_1.environment.security.certificate);
                options.key = fs.readFileSync(environment_1.environment.security.key);
            }
            try {
                this.application = restify.createServer(options);
                this.application.use(restify.plugins.queryParser()); //transforma as querys em json
                this.application.use(restify.plugins.bodyParser()); //transforma o body da request em json
                this.application.use(merge_patch_parser_1.mergePatchBodyParser); //usar o content type diferente no método patch
                this.application.use(token_parser_1.tokenParser); //para transformar o token no padrão jwt "Bearer TOKEN"
                // ===routes===:
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
                this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDb().then(() => this.initRoutes(routers).then(() => this));
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
}
exports.Server = Server;
