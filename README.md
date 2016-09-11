# npms-badges

[![Build status][travis-image]][travis-url] [![Coverage status][coveralls-image]][coveralls-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev dependency status][david-dm-dev-image]][david-dm-dev-url]

The badge generator that generates [npms.io](https://npms.io) score badges.


## Use it

The URL and specifications are based on [shields.io](https://shields.io):

- ![npms score](https://badges.npms.io/cross-spawn.svg) https://badges.npms.io/cross-spawn.svg
- ![npms score](https://badges.npms.io/cross-spawn.svg?style=flat) https://badges.npms.io/cross-spawn.svg?style=flat
- ![npms score](https://badges.npms.io/cross-spawn.svg?style=flat) https://badges.npms.io/cross-spawn.svg?style=plastic


## Development

Simply spawn the server by running `$ npm run start-dev`.


## Deploys

There's a separate document that explains the deployment procedure, you may read it [here](./docs/deploys.md).


## Tests

```bash
$ npm test
$ npm test-cov # to get coverage report
```


## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).


[coveralls-image]: https://img.shields.io/coveralls/npms-io/npms-badges.svg
[coveralls-url]: https://coveralls.io/r/npms-io/npms-badges
[david-dm-dev-image]: https://img.shields.io/david/dev/npms-io/npms-badges.svg
[david-dm-dev-url]: https://david-dm.org/npms-io/npms-badges#info=devDependencies
[david-dm-image]: https://img.shields.io/david/npms-io/npms-badges.svg
[david-dm-url]: https://david-dm.org/npms-io/npms-badges
[travis-image]: http://img.shields.io/travis/npms-io/npms-badges.svg
[travis-url]: https://travis-ci.org/npms-io/npms-badges
