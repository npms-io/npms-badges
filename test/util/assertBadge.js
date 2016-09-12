'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const badgeVault = require('../../lib/util/badgeVault');

function assertBadge(buffer, percentage, options) {
    const score = typeof percentage === 'number' ? percentage / 100 : null;
    const badgeInfo = badgeVault.info(score, options);

    expect(buffer.toString()).to.equal(fs.readFileSync(badgeInfo.filePath).toString());
}

module.exports = assertBadge;
