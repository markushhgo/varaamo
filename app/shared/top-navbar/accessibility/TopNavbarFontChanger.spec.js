import React from 'react';
import simple from 'simple-mock';

import FontSizeChanger from './TopNavbarFontChanger';
import { shallowWithIntl } from 'utils/testUtils';
import ACC from '../../../constants/AppConstants';

describe('shared/top-navbar/accessibility/TopNavbarFontChanger', () => {
  function getWrapper(props) {
    return shallowWithIntl(<FontSizeChanger {...props} />);
  }
  let content;
  beforeAll(() => {
    content = getWrapper();
  });

  test('renders li element', () => {
    const element = content.find('li');
    expect(element.length).toBe(1);
  });

  test('renders accessibility__buttonGroup div', () => {
    const element = content.find('.accessibility__buttonGroup');
    expect(element.length).toBe(1);
  });

  test('renders FontSize title', () => {
    const text = content.find('.accessibility__buttonGroup').text();
    expect(text).toContain('Nav.FontSize.title');
  });

  test('renders buttonspan elements', () => {
    const elements = content.find('span');
    expect(elements.length).toBe(3);
  });

  describe('buttons have correct props at default', () => {
    test('first button', () => {
      const element = content.find('span').first();
      expect(element.prop('aria-pressed')).toBe(true);
      expect(element.prop('className')).toBe('active');
      expect(element.prop('role')).toBe('button');
      expect(element.prop('tabIndex')).toBe('0');
    });

    test('second button', () => {
      const element = content.find('span').at(1);
      expect(element.prop('aria-pressed')).toBe(false);
      expect(element.prop('className')).toBe('');
      expect(element.prop('role')).toBe('button');
      expect(element.prop('tabIndex')).toBe('0');
    });

    test('third button', () => {
      const element = content.find('span').last();
      expect(element.prop('aria-pressed')).toBe(false);
      expect(element.prop('className')).toBe('');
      expect(element.prop('role')).toBe('button');
      expect(element.prop('tabIndex')).toBe('0');
    });
  });

  describe('getActiveFontButton function works when', () => {
    const instance = getWrapper().instance();
    test('fontsize is small', () => {
      const fontSize = instance.getActiveFontButton(ACC.FONT_SIZES.SMALL);
      expect(fontSize).toBe(instance.firstA);
    });

    test('fontsize is medium', () => {
      const fontSize = instance.getActiveFontButton(ACC.FONT_SIZES.MEDIUM);
      expect(fontSize).toBe(instance.secondA);
    });

    test('fontsize is large', () => {
      const fontSize = instance.getActiveFontButton(ACC.FONT_SIZES.LARGE);
      expect(fontSize).toBe(instance.thirdA);
    });
  });
  describe('span elements get active class when selected', () => {
    test('first span get active', () => {
      content.setProps({ fontSize: ACC.FONT_SIZES.SMALL });
      const element = content.find('span').at(0).find('.active');
      expect(element.length).toBe(1);
    });

    test('second span get active', () => {
      content.setProps({ fontSize: ACC.FONT_SIZES.MEDIUM });
      const element = content.find('span').at(1).find('.active');
      expect(element.length).toBe(1);
    });

    test('third span get active', () => {
      content.setProps({ fontSize: ACC.FONT_SIZES.LARGE });
      const element = content.find('span').at(2).find('.active');
      expect(element.length).toBe(1);
    });

    test('only one span is active', () => {
      const element = content.find('span').find('.active');
      expect(element.length).toBe(1);
    });
  });

  describe('span onClicks work', () => {
    test('calls props.changeFontSize', () => {
      const changeFontSize = simple.mock();
      const instance = getWrapper({ changeFontSize }).instance();
      instance.handleFontSizeClick(ACC.FONT_SIZES.SMALL);
      expect(changeFontSize.callCount).toBe(1);
      expect(changeFontSize.lastCall.args).toEqual([ACC.FONT_SIZES.SMALL]);
    });
  });

  describe('span onKeyDown works', () => {
    test('calls props.changeFontSize ', () => {
      const changeFontSize = simple.mock();
      const instance = getWrapper({ changeFontSize }).instance();
      const kbEvent = { keyCode: 13 };
      instance.handleKeyDown(ACC.FONT_SIZES.SMALL, kbEvent);
      expect(changeFontSize.lastCall.args).toEqual([ACC.FONT_SIZES.SMALL]);
    });
  });
});
