import { expect } from '@open-wc/testing';
import { updateLabelLanguageCoalesce } from '../../src/utils/style-helper';

describe('getLabelLanguageCoalesce', () => {

  it('will extend current coalesce ', async () => {
    expect(updateLabelLanguageCoalesce(['coalesce', ['get', 'name_en']], 'de')).to.be.deep.equal(
      ['coalesce', ['get', 'name_de'], ['get', 'name_en']]
    );
  });

  it('wont transform properties without coalesce', async () => {
    expect(updateLabelLanguageCoalesce(['filter', 'xo'], 'de')).to.be.deep.equal(
      ['filter', 'xo']
    );
  });
});
