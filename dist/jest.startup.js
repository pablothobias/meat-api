"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
require("jest");
const server_1 = require("./server/server");
const environment_1 = require("./common/environment");
const users_router_1 = require("./users/users.router");
const reviews_router_1 = require("./reviews/reviews.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const user_model_1 = require("./users/user.model");
const reviews_model_1 = require("./reviews/reviews.model");
const restaurants_model_1 = require("./restaurants/restaurants.model");
let server;
const beforeAllTests = () => {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter,
        reviews_router_1.reviewsRouter,
        restaurants_router_1.restaurantsRouter
    ])
        .then(() => user_model_1.User.remove({}).exec())
        .then(() => reviews_model_1.Review.remove({}).exec())
        .then(() => restaurants_model_1.Restaurant.remove({}).exec())
        .catch(console.error);
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);