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

  constructor(props) {
    super(props);
    this.handleFontSizeClick = this.handleFontSizeClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

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


  handleKeyDown(size, ev) {
    if (ev.keyCode === 13) {
      this.props.changeFontSize(size);
    }
  }

  handleFontSizeClick(size) {
    this.props.changeFontSize(size);
  }

  render() {
    const {
      t, fontSize
    } = this.props;
    const spanID = this.getActiveFontButton(fontSize);
    return (
      <li className="navbar__font" role="presentation">
        <div className="accessability__buttonGroup">
          {t('Nav.FontSize.title')}
          <span className={((spanID === this.firstA) ? 'active' : '')} id={this.firstA} onClick={() => this.handleFontSizeClick(ACC.FONT_SIZES.SMALL)} onKeyDown={ev => this.handleKeyDown(ACC.FONT_SIZES.SMALL, ev)} tabIndex="0">A</span>
          <span className={((spanID === this.secondA) ? 'active' : '')} id={this.secondA} onClick={() => this.handleFontSizeClick(ACC.FONT_SIZES.MEDIUM)} onKeyDown={ev => this.handleKeyDown(ACC.FONT_SIZES.MEDIUM, ev)} tabIndex="0">A</span>
          <span className={((spanID === this.thirdA) ? 'active' : '')} id={this.thirdA} onClick={() => this.handleFontSizeClick(ACC.FONT_SIZES.LARGE)} onKeyDown={ev => this.handleKeyDown(ACC.FONT_SIZES.LARGE, ev)} tabIndex="0">A</span>
        </div>
      </li>

    );
  }
}

export default injectT(FontSizeChanger);
