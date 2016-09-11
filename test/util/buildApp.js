'use strict';

const config = require('config');
const elasticsearch = require('elasticsearch');
const app = require('../../index');

logger.level = 'silent';

function buildApp() {
    return app(config.get('app'), new elasticsearch.Client(config.get('elasticsearch')));
}

module.exports = buildApp;
