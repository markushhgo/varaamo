import React from 'react';


import { shallowWithIntl } from 'utils/testUtils';
import MobileNavbar from './MobileNavbar';
import TopNavbarContrastContainer from '../accessability/TopNavbarContrastContainer';
import TopNavbarFontContainer from '../accessability/TopNavbarFontContainer';


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
});
