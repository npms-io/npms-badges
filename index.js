'use strict';

require('./lib/configure');

const koa = require('koa');
const koaPino = require('koa-pino-logger');
const responseTime = require('koa-response-time');
const error = require('./lib/middleware/error');
const notFound = require('./lib/middleware/not-found');
const routeHandler = require('./lib/routeHandler');

const log = logger.child({ module: 'index' });

module.exports = (config, esClient) => {
    const app = koa();

    // Middleware
    app.use(responseTime());
    app.use(error());
    app.use(notFound());
    app.use(koaPino({ name: 'npms-badges', level: logger.level, serializers: logger.serializers }));

    // App route handler
    app.use(routeHandler(config, esClient));

    // Log errors
    app.on('error', (err) => log.error({ err }, err.message));

    return app;
};
