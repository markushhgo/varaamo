import React from 'react';
import simple from 'simple-mock';

import * as customizationUtils from 'utils/customizationUtils';
import { shallowWithIntl } from 'utils/testUtils';
import Logo from './Logo';
import espooLogoSrc from './espoo-blue-logo.png';
import vantaaLogoSrc from './vantaa-logo.png';
import turkuLogoSrc from './logo_footer.png';

describe('shared/logo/Logo', () => {
  function getWrapper() {
    return shallowWithIntl(<Logo />);
  }

  describe('When there is no customization in use', () => {
    let logo;

    beforeAll(() => {
      logo = getWrapper();
    });

    test('renders logo of Turku', () => {
      expect(logo.type()).toBe('img');
      expect(logo.props().src).toBe(turkuLogoSrc);
    });

    test('renders Turku alt text', () => {
      expect(logo.props().alt).toBe('Logo.turkuAlt');
    });
  });

  describe('When Espoo customization is used', () => {
    let logo;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      logo = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders logo of Espoo', () => {
      expect(logo.type()).toBe('img');
      expect(logo.props().src).toBe(espooLogoSrc);
    });

    test('renders Espoo alt text', () => {
      expect(logo.props().alt).toBe('Logo.espooAlt');
    });
  });

  describe('When Vantaa customization is used', () => {
    let logo;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('VANTAA');
      logo = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders logo of Vantaa', () => {
      expect(logo.type()).toBe('img');
      expect(logo.props().src).toBe(vantaaLogoSrc);
    });

    test('renders Vantaa alt text', () => {
      expect(logo.props().alt).toBe('Logo.vantaaAlt');
    });
  });
});
