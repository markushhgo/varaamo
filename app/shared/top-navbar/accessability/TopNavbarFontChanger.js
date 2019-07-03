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

  handleFontSize(size) {
    switch (size) {
      case '__font-size-1':
        return 'first';
      case '__font-size-2':
        return 'second';
      case '__font-size-3':
        return 'third';
      default:
        return 'first';
    }
  }

  render() {
    const {
      t, fontSize, changeFontSize
    } = this.props;
    const spanID = this.handleFontSize(fontSize);
    return (
      <li className="app-TopNavbar__font" role="presentation">
        <div className="accessability__buttonGroup">
          {t('Nav.FontSize.title')}
          <span className={((spanID === 'first') ? 'active' : '')} id="first" onClick={() => changeFontSize(ACC.FONT_SIZES.SMALL)} tabIndex="0">A</span>
          <span className={((spanID === 'second') ? 'active' : '')} id="second" onClick={() => changeFontSize(ACC.FONT_SIZES.MEDIUM)} tabIndex="0">A</span>
          <span className={((spanID === 'third') ? 'active' : '')} id="third" onClick={() => changeFontSize(ACC.FONT_SIZES.LARGE)} tabIndex="0">A</span>
        </div>
      </li>

    );
  }
}

export default injectT(FontSizeChanger);
