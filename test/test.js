'use strict';

const formats = ['svg', 'png'];
const styles = ['flat', 'flat-square', 'plastic'];

describe('format and styles', () => {
    formats.forEach((format) => {
        styles.forEach((style) => {
            it(`should output a ${style} ${format} image`);
        });
    });
});

describe('behavior', () => {
    it('should render unknown badge if module does not exist');

    it('should render unknown badge if score is not yet calculated');

    it('should set cache-control headers to cache badge');

    it('should set cache-control headers to not cache unknown badges');
});
