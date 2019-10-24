import React from 'react';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import AccessibilityInfoPage from './AccessibilityInfoPage';


describe('pages/accessibility-info/AccessibilityInfoPage', () => {
  function getWrapper() {
    return shallowWithIntl(<AccessibilityInfoPage />);
  }

  test('componentDidMount', () => {
    const scrollToSpy = jest.fn();
    Object.defineProperty(global.window, 'scrollTo', { value: scrollToSpy });
    const instance = getWrapper().instance();
    instance.componentDidMount();
    expect(scrollToSpy).toHaveBeenCalled();
  });

  test('renders PageWrapper with correct props', () => {
    const pageWrapper = getWrapper().find(PageWrapper);
    expect(pageWrapper).toHaveLength(1);
    expect(pageWrapper.prop('className')).toBe('accessibility-info-page');
    expect(pageWrapper.prop('title')).toBe('AccessibilityInfo.title');
  });

  test('renders div that contains text', () => {
    const element = getWrapper().find('div');
    expect(element).toHaveLength(1);
  });
});
