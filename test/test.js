'use strict';

const config = require('config');
const expect = require('chai').expect;
const nock = require('nock');
const supertest = require('supertest-as-promised');
const range = require('lodash/range');
const buildApp = require('./util/buildApp');
const assertBadge = require('./util/assertBadge');
const badgeVault = require('../lib/util/badgeVault');

const server = buildApp().listen();
const request = supertest.agent(server);

afterEach(() => nock.cleanAll());

after((done) => {
    server.close(done);
});

describe('behavior', () => {
    it('should round score and display appropriate badge', () => {
        nock('http://127.0.0.1:9200')
        .get('/npms-current/score/gulp')
        .query({ _source: 'score.final' })
        .reply(200, {
            _source: { score: { final: 0.888 } },
        });

        return request
        .get('/gulp.svg')
        .expect(200)
        .then((res) => {
            expect(res.headers['content-type']).to.contain('svg');
            assertBadge(res.body, 89, { format: 'svg' });
            expect(nock.isDone()).to.equal(true);
        });
    });

    it('should render unknown badge if score does not exist', () => {
        nock('http://127.0.0.1:9200')
        .get('/npms-current/score/gulp')
        .query({ _source: 'score.final' })
        .reply(404, {});

        return request
        .get('/gulp.svg')
        .expect(200)
        .then((res) => {
            expect(res.headers['content-type']).to.contain('svg');
            assertBadge(res.body, null, { format: 'svg' });
            expect(nock.isDone()).to.equal(true);
        });
    });

    it('should render unknown badge if score is not yet calculated', () => {
        nock('http://127.0.0.1:9200')
        .get('/npms-current/score/gulp')
        .query({ _source: 'score.final' })
        .reply(200, {});

        return request
        .get('/gulp.svg')
        .expect(200)
        .then((res) => {
            expect(res.headers['content-type']).to.contain('svg');
            assertBadge(res.body, null, { format: 'svg' });
            expect(nock.isDone()).to.equal(true);
        });
    });
});

describe('errors & validation', () => {
    it('should fail on invalid endpoint', () => (
        request
        .get('/gulp')
        .expect(404, { code: 'NOT_FOUND', message: 'The specified endpoint does not exist' })
        .then((res) => {
            expect(res.body).to.eql({ code: 'NOT_FOUND', message: 'The specified endpoint does not exist' });
        })
    ));

    it('should fail on invalid score name', () => (
        request
        .get('/_foo.svg')
        .expect(400, { code: 'INVALID_PARAMETER', message: 'name cannot start with an underscore ("_foo")' })
    ));

    it('should fail on invalid format', () => (
        request
        .get('/foo.foo')
        .expect(400, { code: 'INVALID_PARAMETER', message: 'child "format" fails because ["format" must be one of \
[svg, png, json]]' })
    ));

    it('should fail on invalid style', () => (
        request
        .get('/foo.svg?style=foo')
        .expect(400, { code: 'INVALID_PARAMETER', message: 'child "style" fails because ["style" must be one of \
[flat, flat-square, plastic]]' })
    ));

    it('should fail if style is specified with json format', () => (
        request
        .get('/foo.json?style=foo')
        .expect(400, { code: 'INVALID_PARAMETER', message: 'child "style" fails because ["style" is not allowed]' })
    ));
});

describe('cache', () => {
    it('should set cache-control headers to cache badges', () => {
        nock('http://127.0.0.1:9200')
        .get('/npms-current/score/gulp')
        .query({ _source: 'score.final' })
        .reply(200, {
            _source: { score: { final: 0.8 } },
        });

        return request
        .get('/gulp.svg')
        .expect(200)
        .then((res) => {
            expect(res.headers['cache-control']).to.equal(`public,max-age=${config.get('app.maxAge')}`);
            expect(nock.isDone()).to.equal(true);
        });
    });

    it('should set cache-control headers to not cache unknown badges', () => {
        nock('http://127.0.0.1:9200')
        .get('/npms-current/score/gulp')
        .query({ _source: 'score.final' })
        .reply(404);

        return request
        .get('/gulp.svg')
        .expect(200)
        .then((res) => {
            expect(res.headers['cache-control']).to.equal('public,no-cache');
            expect(nock.isDone()).to.equal(true);
        });
    });

    it('should respect ETag', () => {
        nock('http://127.0.0.1:9200')
        .get('/npms-current/score/gulp')
        .query({ _source: 'score.final' })
        .reply(200, {
            _source: { score: { final: 0.8 } },
        });

        const badgeInfo = badgeVault.info(0.8, { format: 'svg', revision: config.get('app.revision') });

        return request
        .get('/gulp.svg')
        .set('If-None-Match', `W/"${badgeInfo.id}"`)
        .expect(304)
        .then((res) => {
            expect(res.body).to.be.empty;
        });
    });
});

describe('scores, formats and styles', () => {
    const formats = ['svg', 'png'];
    const styles = ['flat', 'flat-square', 'plastic'];
    const scores = range(0, 101).map((score) => score / 100);

    // Images
    formats.forEach((format) => {
        styles.forEach((style) => {
            scores.forEach((score) => {
                it(`should output a ${style} ${format} image for score ${score}`, () => {
                    nock('http://127.0.0.1:9200')
                    .get('/npms-current/score/gulp')
                    .query({ _source: 'score.final' })
                    .reply(200, {
                        _source: { score: { final: score } },
                    });

                    return request
                    .get(`/gulp.${format}?style=${style}`)
                    .expect(200)
                    .then((res) => {
                        expect(res.headers['content-type']).to.contain(format);
                        assertBadge(res.body, score * 100, { style, format });
                        expect(nock.isDone()).to.equal(true);
                    });
                });
            });
        });
    });

    // JSON
    it('should output JSON', () => {
        nock('http://127.0.0.1:9200')
        .get('/npms-current/score/gulp')
        .query({ _source: 'score.final' })
        .reply(200, {
            _source: { score: { final: 0.888 } },
        });

        return request
        .get('/gulp.json')
        .expect(200)
        .then((res) => {
            expect(res.headers['content-type']).to.contain('json');
            expect(res.body).to.eql({ name: 'npms score', value: '89%' });
            expect(nock.isDone()).to.equal(true);
        });
    });
});
