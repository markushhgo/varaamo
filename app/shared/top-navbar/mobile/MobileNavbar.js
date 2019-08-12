import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Col, Row } from 'react-bootstrap';

import FontChanger from 'shared/top-navbar/accessibility/TopNavbarFontContainer';
import ContrastChanger from 'shared/top-navbar/accessibility/TopNavbarContrastContainer';

class MobileNavbar extends React.Component {
  static propTypes = {
    toggle: PropTypes.bool,
    contrast: PropTypes.bool,

  };


  getCollapseStatus = () => (this.props.toggle ? '' : 'is-collapsed')

  getAriaVisibility = () => (!this.props.toggle)

  getContrastStatus = () => (this.props.contrast ? '' : 'high-contrast')

  getFontChanger() {
    return <FontChanger />;
  }

  getContrastChanger() {
    return <ContrastChanger />;
  }

  render() {
    const element = this.getCollapseStatus();
    const contrast = this.getContrastStatus();
    const ariaHide = this.getAriaVisibility();
    const fontComponent = this.getFontChanger();
    const contrastComponent = this.getContrastChanger();
    return (
      <div aria-hidden={ariaHide} aria-live="polite" className={classNames('mobile-Navbar_mobile', element, contrast)} id="mobileNavbar">
        <div className="container">
          <Row>
            <Col sm={6} smOffset={6} xs={12}>
              <ul>
                {contrastComponent}
                {fontComponent}
              </ul>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


export default MobileNavbar;
