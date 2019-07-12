import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Col, Row } from 'react-bootstrap';

import FontChanger from 'shared/top-navbar/accessability/TopNavbarFontContainer';
import ContrastChanger from 'shared/top-navbar/accessability/TopNavbarContrastContainer';

class MobileNavbar extends React.Component {
  static propTypes = {
    toggle: PropTypes.bool,
  };

  getFontChanger() {
    return <FontChanger />;
  }

  getContrastChanger() {
    return <ContrastChanger />;
  }

  render() {
    const element = this.props.toggle ? '' : 'is-collapsed';
    const fontComponent = this.getFontChanger();
    const contrastComponent = this.getContrastChanger();
    return (
      <div className={classNames('mobile-Navbar_mobile', element)}>
        <div className="container">
          <Row>
            <Col className="col-xs-12">
              <ul>
                {fontComponent}
                {contrastComponent}
              </ul>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


export default MobileNavbar;
