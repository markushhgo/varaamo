import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import { Container } from 'react-bootstrap';

import ACC from '../../constants/AppConstants';
import { injectT } from 'i18n';

class TopNavbar extends Component {
  static propTypes = {
    changeLocale: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    changeContrast: PropTypes.func,
    changeFontSize: PropTypes.func,
    contrast: PropTypes.bool,
    fontSize: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  collapseItem() {
    this.setState({ expanded: false });
  }

  toggleCollapse() {
    this.setState(prevState => ({ expanded: !prevState.expanded }));
  }


  handleLoginClick() {
    const next = encodeURIComponent(window.location.href);
    window.location.assign(`${window.location.origin}/login?next=${next}`);
  }

  handleFontSize(size) {
    switch (size) {
      case 'font-size-1':
        return 'first';
      case 'font-size-2':
        return 'second';
      case 'font-size-3':
        return 'third';
      default:
        return 'first';
    }
  }

  render() {
    const {
      changeLocale,
      currentLanguage,
      isLoggedIn,
      t,
      userName,
      changeContrast,
      changeFontSize,
      contrast,
      fontSize,
    } = this.props;
    const highContrastNav = contrast ? '' : 'nav-high-contrast';
    const logo = (currentLanguage === 'sv') ? 'turku-logo-sv' : 'turku-logo';
    const fs = this.handleFontSize(fontSize);
    return (
      <Navbar className={classNames('app-TopNavbar', highContrastNav)} expanded={this.state.expanded} fluid onToggle={() => this.toggleCollapse()}>
        <Navbar.Toggle />
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <span className={`${logo}`} />
            </Link>
          </Navbar.Brand>
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <li className="app-TopNavbar__font" role="presentation">
              <div className="font_buttonGroup">
                {t('Nav.FontSize.title')}
                <span className={((fs === 'first') ? 'active' : '')} id="first" onClick={() => changeFontSize(ACC.FONT_SIZES.SMALL)}>A</span>
                <span className={((fs === 'second') ? 'active' : '')} id="second" onClick={() => changeFontSize(ACC.FONT_SIZES.MEDIUM)}>A</span>
                <span className={((fs === 'third') ? 'active' : '')} id="third" onClick={() => changeFontSize(ACC.FONT_SIZES.LARGE)}>A</span>
              </div>
            </li>
            <NavItem className="app-TopNavbar__contrast" onClick={changeContrast}>
              {t('Nav.Contrast.title')}
            </NavItem>

            <NavDropdown
              className="app-TopNavbar__language"
              eventKey="lang"
              id="language-nav-dropdown"
              noCaret
              onSelect={changeLocale}
              title={currentLanguage}
            >
              {currentLanguage !== 'en' && <MenuItem eventKey="en">EN</MenuItem>}
              {currentLanguage !== 'fi' && <MenuItem eventKey="fi">FI</MenuItem>}
              {currentLanguage !== 'sv' && <MenuItem eventKey="sv">SV</MenuItem>}
            </NavDropdown>

            {isLoggedIn && (
              <NavDropdown
                className="app-TopNavbar__name"
                eventKey="lang"
                id="user-nav-dropdown"
                noCaret
                title={userName}
              >
                <MenuItem eventKey="logout" href={`/logout?next=${window.location.origin}`}>
                  {t('Navbar.logout')}
                </MenuItem>
              </NavDropdown>
            )}

            {!isLoggedIn && (
              <NavItem id="app-TopNavbar__login" onClick={this.handleLoginClick}>
                {t('Navbar.login')}
              </NavItem>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default injectT(TopNavbar);
