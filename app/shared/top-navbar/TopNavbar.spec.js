import React from 'react';
import NavItem from 'react-bootstrap/lib/NavItem';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import { shallowWithIntl } from 'utils/testUtils';
import TopNavbar from './TopNavbar';
import MobileNavbar from './mobile/MobileNavbar';

describe('shared/top-navbar/TopNavbar', () => {
  function getWrapper(props) {
    const defaults = {
      changeLocale: () => null,
      currentLanguage: 'fi',
      isLoggedIn: false,
      userName: 'Luke Skywalker',
    };
    return shallowWithIntl(<TopNavbar {...defaults} {...props} />);
  }

  describe('renders mobile', () => {
    test('renders MobileNavbar', () => {
      const element = getWrapper().find(MobileNavbar);
      expect(element.length).toBe(1);
    });

    test('renders all 3 navbar-toggles', () => {
      const first = getWrapper().find('.navbar-toggle');
      expect(first.length).toBe(2);
      const second = getWrapper().find('.navbar-toggle.lang');
      expect(second.length).toBe(1);
    });
  });

  describe('language nav', () => {
    function getLanguageNavWrapper(props) {
      return getWrapper(props).find('#language-nav-dropdown');
    }

    test('is rendered', () => {
      expect(getLanguageNavWrapper()).toHaveLength(1);
    });

    test('has changeLocale as onSelect prop', () => {
      const changeLocale = () => null;
      const actual = getLanguageNavWrapper({ changeLocale }).prop('onSelect');
      expect(actual).toBe(changeLocale);
    });

    test('renders MenuItems for other languages', () => {
      const currentLanguage = 'fi';
      const menuItems = getLanguageNavWrapper({ currentLanguage }).find(MenuItem);
      expect(menuItems).toHaveLength(1);
      expect(menuItems.at(0).prop('eventKey')).toBe('sv');
    });
  });

  describe('if user is logged in but is not an admin', () => {
    const props = {
      isAdmin: false,
      isLoggedIn: true,
      userName: 'Luke',
    };
    function getLoggedInNotAdminWrapper() {
      return getWrapper({ ...props });
    }

    test('renders the name of the logged in user', () => {
      const userNavDropDown = getLoggedInNotAdminWrapper().find('#user-nav-dropdown');
      expect(userNavDropDown).toHaveLength(1);
      expect(userNavDropDown.at(0).prop('title')).toBe(props.userName);
    });

    test('renders a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = getLoggedInNotAdminWrapper()
        .find(MenuItem)
        .filter({ href: logoutHref });
      expect(logoutLink).toHaveLength(1);
    });

    test('does not render a link to login page', () => {
      const loginLink = getLoggedInNotAdminWrapper()
        .find(NavItem)
        .filter('#app-TopNavbar__login');
      expect(loginLink).toHaveLength(0);
    });
  });

  describe('if user is not logged in', () => {
    const props = {
      isLoggedIn: false,
    };
    function getNotLoggedInWrapper() {
      return getWrapper({ ...props });
    }

    test('renders a link to login page', () => {
      const wrapper = getNotLoggedInWrapper();
      const loginLink = wrapper.find(NavItem).filter('#app-TopNavbar__login');
      expect(loginLink).toHaveLength(1);
      expect(loginLink.at(0).prop('onClick')).toBe(wrapper.instance().handleLoginClick);
    });

    test('does not render a logout link', () => {
      const logoutHref = `/logout?next=${window.location.origin}`;
      const logoutLink = getNotLoggedInWrapper()
        .find(NavItem)
        .filter({ href: logoutHref });
      expect(logoutLink).toHaveLength(0);
    });
  });
});
