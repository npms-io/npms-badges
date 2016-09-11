'use strict';

const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
const stat = Promise.promisify(require('fs').stat);

const cache = {};
const badgesDir = `${__dirname}/../../badges`;

function info(score, style, format) {
    const isUnknown = typeof score !== 'number';

    return {
        id: `${isUnknown ? 'unknown' : score}/${isUnknown ? 'unknown' : score}-${style}.${format}`,
        isUnknown,
    };
}

function get(score, style, format) {
    const badgeInfo = info(score, style, format);

    if (cache[badgeInfo.id]) {
        return cache[badgeInfo.id];
    }

    const filePath = `${badgesDir}/${badgeInfo.id}`;

    const promise = cache[badgeInfo.id] = Promise.props(Object.assign(badgeInfo, {
        filePath,
        buffer: readFile(filePath),
        stats: stat(filePath),
    }));

    promise.catch(() => {
        delete cache[badgeInfo.id];
    });

    return promise;
}

module.exports.get = get;
module.exports.info = info;
