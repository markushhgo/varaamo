import React from 'react';
import { shallow } from 'enzyme';

import CookieBar from './CookieBar';

describe('shared/CookieBar', () => {
  function getWrapper() {
    return shallow(<CookieBar />);
  }

  test('renders CookieBar with correct props', () => {
    const wrapper = getWrapper();
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('buttonClasses')).toBe('cookie-accept-button');
    expect(wrapper.prop('buttonId')).toBe('cookie-accept-button');
    expect(wrapper.prop('buttonText')).toBeDefined();
    expect(wrapper.prop('contentStyle')).toEqual({ flex: 'auto' });
    expect(wrapper.prop('declineButtonClasses')).toBe('cookie-decline-button');
    expect(wrapper.prop('declineButtonId')).toBe('cookie-decline-button');
    expect(wrapper.prop('declineButtonText')).toBeDefined();
    expect(wrapper.prop('disableButtonStyles')).toBe(true);
    expect(wrapper.prop('enableDeclineButton')).toBe(true);
    expect(wrapper.prop('onDecline')).toBeDefined();
    expect(wrapper.prop('expires')).toBe(90);
    expect(wrapper.prop('setDeclineCookie')).toBe(false);
  });

  describe('CookieBar renders with correct language', () => {
    const { navigator } = window;

    beforeAll(() => {
      delete window.navigator;
    });

    afterAll(() => {
      window.navigator = navigator;
    });

    describe('when window.navigator.language is sv', () => {
      test('render wrapper with correct props', () => {
        window.navigator = { language: 'sv' };
        const wrapper = getWrapper();
        const cookieDescription = 'Vi använder cookies för att kunna ge dig en bättre upplevelse. Genom att du fortsätter att använda Varaamo så accepterar du användingen av cookies.';
        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop('buttonText')).toBe('Godkänn');
        expect(wrapper.prop('declineButtonText')).toBe('Avvisa');
        expect(wrapper.contains(cookieDescription)).toBe(true);
      });

      test('renders link to cookie policy with correct props', () => {
        window.navigator = { language: 'sv' };
        const policyLink = getWrapper().find('a');
        expect(policyLink.length).toBe(1);
        expect(policyLink.prop('href')).toEqual('https://varaamo.turku.fi:8007/cookieInformation-sv.html');
        expect(policyLink.prop('style')).toEqual({ color: 'white' });
        expect(policyLink.text()).toEqual('Länk till Cookie Policy');
      });
    });

    describe('when window.navigator.language is fi', () => {
      test('render wrapper with correct props', () => {
        window.navigator = { language: 'fi' };
        const cookieDescription = 'Käytämme evästeitä parantaaksemme käyttökokemustasi. Jatkamalla Varaamon käyttöä hyväksyt evästeiden käytön.';
        const wrapper = getWrapper();
        expect(wrapper).toHaveLength(1);
        expect(wrapper.prop('buttonText')).toBe('Hyväksyn');
        expect(wrapper.prop('declineButtonText')).toBe('Hylkää');
        expect(wrapper.contains(cookieDescription)).toBe(true);
      });

      test('renders link to cookie policy with correct props', () => {
        window.navigator = { language: 'fi' };
        const policyLink = getWrapper().find('a');
        expect(policyLink.length).toBe(1);
        expect(policyLink.prop('href')).toEqual('https://varaamo.turku.fi:8007/cookieInformation-fi.html');
        expect(policyLink.prop('style')).toEqual({ color: 'white' });
        expect(policyLink.text()).toEqual('Linkki Evästekäytäntöön');
      });
    });
  });

  test('renders div.cookiePolicy', () => {
    const div = getWrapper().find('div.cookiePolicy');
    expect(div.length).toBe(1);
  });
});
