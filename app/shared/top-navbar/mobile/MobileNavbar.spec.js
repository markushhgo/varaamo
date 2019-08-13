import React from 'react';


import { shallowWithIntl } from 'utils/testUtils';
import MobileNavbar from './MobileNavbar';
import TopNavbarContrastContainer from '../accessibility/TopNavbarContrastContainer';
import TopNavbarFontContainer from '../accessibility/TopNavbarFontContainer';


describe('shared/top-navbar/mobile/MobileNavbar', () => {
  function getWrapper(props) {
    const defaults = {
      changeLocale: () => null,
      currentLanguage: 'fi',
      isLoggedIn: false,
      userName: 'Luke Skywalker',
    };
    return shallowWithIntl(<MobileNavbar {...defaults} {...props} />);
  }

  test('render contrastChanger', () => {
    const element = getWrapper().find(TopNavbarContrastContainer);
    expect(element.length).toBe(1);
  });

  test('render fontChanger', () => {
    const element = getWrapper().find(TopNavbarFontContainer);
    expect(element.length).toBe(1);
  });

  describe('div.mobile-nav ', () => {
    const prop = {
      toggle: false,
      contrast: '',
    };

    test('has correct props', () => {
      const element = getWrapper({ prop }).find('div').first();
      expect(element.prop('aria-hidden')).toBe(true);
      expect(element.hasClass('is-collapsed')).toBe(true);
      expect(element.hasClass('high-contrast')).toBe(false);
    });

    test('has correct prop when isHighContrast: true', () => {
      const element = getWrapper({ contrast: 'high-contrast' }).find('div').first();
      expect(element.hasClass('high-contrast')).toBe(true);
    });

    test('has correct prop when toggle: true', () => {
      const element = getWrapper({ toggle: true }).find('div').first();
      expect(element.prop('aria-hidden')).toBe(false);
      expect(element.hasClass('is-collapsed')).toBe(false);
    });
  });
});
