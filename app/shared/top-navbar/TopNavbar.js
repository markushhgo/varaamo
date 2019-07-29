import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import NavItem from 'react-bootstrap/lib/NavItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWheelchair, faUserAlt
} from '@fortawesome/free-solid-svg-icons';

import MobileNavbar from 'shared/top-navbar/mobile/MobileNavbar';
import FontChanger from './accessability/TopNavbarFontContainer';
import ContrastChanger from './accessability/TopNavbarContrastContainer';
import { injectT } from 'i18n';

class TopNavbar extends Component {
  static propTypes = {
    changeLocale: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    contrast: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      expandMobileNavbar: false,
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

  toggleMobileNavbar() {
    this.setState(prevState => ({ expandMobileNavbar: !prevState.expandMobileNavbar }));
  }

  render() {
    const {
      changeLocale,
      currentLanguage,
      isLoggedIn,
      t,
      userName,
      contrast,
    } = this.props;
    const highContrastNav = contrast ? '' : 'high-contrast';
    const logo = (currentLanguage === 'sv') ? 'turku-logo-sv' : 'turku-logo';
    return (
      <div>
        <MobileNavbar contrast={contrast} toggle={this.state.expandMobileNavbar} />
        <Navbar className={classNames('app-TopNavbar', highContrastNav)} expanded={this.state.expanded} fluid onToggle={() => this.toggleCollapse()}>

          <Navbar.Header>
            <Navbar.Toggle data-target="#navCollapse">
              <div className="mobile_login" type="button">
                <FontAwesomeIcon icon={faUserAlt} />
              </div>
            </Navbar.Toggle>
            <div className="navbar-toggle">
              <div className="mobile_accessability" onClick={() => this.toggleMobileNavbar()} type="button">
                <FontAwesomeIcon icon={faWheelchair} />
              </div>
            </div>
            <div className="navbar-toggle lang" data-target="#login" data-toggle="collapse">
              <div className="mobile_lang" type="button">
                <NavDropdown
                  className="mobile_lang_dropdown"
                  eventKey="lang"
                  id="mobile"
                  noCaret
                  onSelect={changeLocale}
                  title={currentLanguage}
                >
                  {currentLanguage !== 'fi' && <MenuItem eventKey="fi">FI</MenuItem>}
                  {currentLanguage !== 'sv' && <MenuItem eventKey="sv">SV</MenuItem>}
                </NavDropdown>
              </div>
            </div>
            <Navbar.Brand>
              <Link aria-label="etusivulle" id="main" to="/">
                <span aria-label="Turun vaakuna" className={`${logo}`} title="Etusivu" />
              </Link>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse id="navCollapse">
            <Nav pullRight>
              <FontChanger />

              <ContrastChanger />

              <NavDropdown
                className="app-TopNavbar__language"
                eventKey="lang"
                id="language-nav-dropdown"
                noCaret
                onSelect={changeLocale}
                title={currentLanguage}
              >
                {currentLanguage !== 'fi' && <MenuItem eventKey="fi">FI</MenuItem>}
                {currentLanguage !== 'sv' && <MenuItem eventKey="sv">SV</MenuItem>}
              </NavDropdown>

              {isLoggedIn && (
              <NavDropdown
                aria-label="Logout"
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
      </div>
    );
  }
}

export default injectT(TopNavbar);
