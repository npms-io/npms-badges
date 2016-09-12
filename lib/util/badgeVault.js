'use strict';

const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
const stat = Promise.promisify(require('fs').stat);

const cache = {};
const badgesDir = `${__dirname}/../../badges`;

function info(score, options) {
    const isUnknown = typeof score !== 'number';

    options = Object.assign({ format: 'svg', style: 'flat', revision: 1 }, options);

    const percentage = !isUnknown ? Math.round(score * 100) : null;
    const value = !isUnknown ? `${percentage}%` : 'unknown';
    const file = `${isUnknown ? 'unknown' : percentage}/${isUnknown ? 'unknown' : percentage}-${options.style}.${options.format}`;

    return {
        id: `${file}.rev${options.revision}`,
        value,
        filePath: `${badgesDir}/${file}`,
        isUnknown,
    };
}

function get(score, options) {
    options = Object.assign({ format: 'svg', style: 'flat' }, options);

    const badgeInfo = info(score, options);

    if (cache[badgeInfo.id]) {
        return cache[badgeInfo.id];
    }

    const promise = cache[badgeInfo.id] = Promise.props(Object.assign(badgeInfo, {
        buffer: readFile(badgeInfo.filePath),
        stats: stat(badgeInfo.filePath),
    }));

    promise.catch(() => {
        /* istanbul ignore next */
        delete cache[badgeInfo.id];
    });

    return promise;
}

module.exports.get = get;
module.exports.info = info;
