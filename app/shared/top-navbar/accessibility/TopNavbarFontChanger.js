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


  setActiveClass(spanID) {
    const span = this.getActiveFontButton(this.props.fontSize);
    return ((span === spanID) ? 'active' : '');
  }

  setAriaPressed(spanID) {
    const span = this.getActiveFontButton(this.props.fontSize);
    return ((span === spanID));
  }

  handleKeyDown(size, ev) {
    if (ev.keyCode === 13) {
      this.props.changeFontSize(size);
    }
  }

  handleFontSizeClick(size) {
    this.props.changeFontSize(size);
  }

  renderFontButton(spanID, fontSize) {
    return (
      <span
        aria-pressed={this.setAriaPressed(spanID)}
        className={this.setActiveClass(spanID)}
        onClick={() => this.handleFontSizeClick(fontSize)}
        onKeyDown={ev => this.handleKeyDown(fontSize, ev)}
        role="button"
        tabIndex="0"
      >
A

      </span>
    );
  }

  render() {
    const {
      t
    } = this.props;

    return (
      <li className="navbar__font" role="presentation">
        <div aria-label={t('Nav.FontSize.title')} className="accessibility__buttonGroup">
          {t('Nav.FontSize.title')}
          {this.renderFontButton(this.firstA, ACC.FONT_SIZES.SMALL)}
          {this.renderFontButton(this.secondA, ACC.FONT_SIZES.MEDIUM)}
          {this.renderFontButton(this.thirdA, ACC.FONT_SIZES.LARGE)}
        </div>
      </li>

    );
  }
}

export default injectT(FontSizeChanger);
