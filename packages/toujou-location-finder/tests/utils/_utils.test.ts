import { expect } from '@open-wc/testing';
import {convertToLegacyColorString} from '../../src/utils/_utils';

describe('convertToLegacyColorString', () => {

    it('will return unmodified hex string', async () => {
        expect(convertToLegacyColorString('#FFF')).to.be.equal('#FFF');
    });

    it('will return unmodified legacy rgb strings', async () => {
        expect(convertToLegacyColorString('rgba(255,0,0,0.3)')).to.be.equal('rgba(255,0,0,0.3)');
        expect(convertToLegacyColorString('rgb(255,0,0)')).to.be.equal('rgb(255,0,0)');
    });

    it('will return unmodified legacy hsl string', async () => {
        expect(convertToLegacyColorString('hsla(120,100%,50%,0.3)')).to.be.equal('hsla(120,100%,50%,0.3)');
        expect(convertToLegacyColorString('hsl(120,100%,50%)')).to.be.equal('hsl(120,100%,50%)');
    });

    it('will return legacy strings on modern color syntax', async () => {
        expect(convertToLegacyColorString('hsla(120 100% 50% 0.3)')).to.be.equal('hsla(120,100%,50%,0.3)');
        expect(convertToLegacyColorString('hsl(120 100% 50%)')).to.be.equal('hsl(120,100%,50%)');
        expect(convertToLegacyColorString('rgba(255 0 0 0.3)')).to.be.equal('rgba(255,0,0,0.3)');
        expect(convertToLegacyColorString('rgb(255 0 0)')).to.be.equal('rgb(255,0,0)');
    });
});
