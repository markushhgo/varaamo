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


  /**
   * Checks if spanID is the active fontsize
   * @param {string} spanID
   */
  setActiveClass(spanID) {
    const span = this.getActiveFontButton(this.props.fontSize);
    return ((span === spanID) ? 'active' : '');
  }

  /**
   * Checks if spanID is the active fontsize
   * @param {string} spanID
   * @returns {Boolean} true/false
   */
  setAriaPressed(spanID) {
    const span = this.getActiveFontButton(this.props.fontSize);
    return ((span === spanID));
  }

  handleFontSizeClick(size) {
    this.props.changeFontSize(size);
  }

  /**
   *
   * @param {string} spanID
   * @param {string} fontSize
   *
   * @returns {html} <button> element
   */
  renderFontButton(spanID, fontSize) {
    return (
      <button
        aria-pressed={this.setAriaPressed(spanID)}
        className={this.setActiveClass(spanID)}
        onClick={() => this.handleFontSizeClick(fontSize)}
        type="button"
      >
A

      </button>
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
