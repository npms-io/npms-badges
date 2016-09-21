# npms-badges

[![Build status][travis-image]][travis-url] [![Coverage status][coveralls-image]][coveralls-url] [![Dependency status][david-dm-image]][david-dm-url] [![Dev dependency status][david-dm-dev-image]][david-dm-dev-url]

The score badge service for [npms.io](https://npms.io).


## Use it

The URL and specifications are based on [shields.io](https://shields.io):

![npms score](https://badges.npms.io/cross-spawn.svg) - https://badges.npms.io/cross-spawn.svg   
![npms score](https://badges.npms.io/cross-spawn.svg?style=flat-square) - https://badges.npms.io/cross-spawn.svg?style=flat-square   
![npms score](https://badges.npms.io/cross-spawn.svg?style=plastic) - https://badges.npms.io/cross-spawn.svg?style=plastic

The `.png` and `.json` extensions are also available.


## Development

Make sure you got a Elasticsearch instance running and filled with analysis data.
Then simply spawn the server by running `$ npm run start-dev`.


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
