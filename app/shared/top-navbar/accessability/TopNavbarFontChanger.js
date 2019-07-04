import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { injectT } from 'i18n';
import ACC from '../../../constants/AppConstants';

class FontSizeChanger extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    fontSize: PropTypes.string,
    changeFontSize: PropTypes.func,
  };

  firstA = 'firstA';

  secondA = 'secondA';

  thirdA = 'thirdA';


  getActiveFontButton(size) {
    switch (size) {
      case ACC.FONT_SIZES.SMALL:
        return this.firstA;
      case ACC.FONT_SIZES.MEDIUM:
        return this.secondA;
      case ACC.FONT_SIZES.LARGE:
        return this.thirdA;
      default:
        return this.firstA;
    }
  }

  render() {
    const {
      t, fontSize, changeFontSize
    } = this.props;
    const spanID = this.getActiveFontButton(fontSize);
    return (
      <li className="app-TopNavbar__font" role="presentation">
        <div className="accessability__buttonGroup">
          {t('Nav.FontSize.title')}
          <span className={((spanID === this.firstA) ? 'active' : '')} id={this.firstA} onClick={() => changeFontSize(ACC.FONT_SIZES.SMALL)} tabIndex="0">A</span>
          <span className={((spanID === this.secondA) ? 'active' : '')} id={this.secondA} onClick={() => changeFontSize(ACC.FONT_SIZES.MEDIUM)} tabIndex="0">A</span>
          <span className={((spanID === this.thirdA) ? 'active' : '')} id={this.thirdA} onClick={() => changeFontSize(ACC.FONT_SIZES.LARGE)} tabIndex="0">A</span>
        </div>
      </li>

    );
  }
}

export default injectT(FontSizeChanger);
