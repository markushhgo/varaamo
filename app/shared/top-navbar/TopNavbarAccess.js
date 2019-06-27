import Proptypes from 'prop-types';
import React from 'react';

import { injectT } from 'i18n';
import ACC from '../../constants/AppConstants';

function FontSizeChangers(size, { t }) {
  const fs = () => {
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
  };

  return (
    <li className="app-Topnavbar__font" role="presentation">
      <div className="font_buttonGroup">
        {t('Nav.FontSize.title')}
        <span className={((fs === 'first') ? 'active' : '')} id="first" onClick={() => changeFontSize(ACC.FONT_SIZES.SMALL)}>A</span>
        <span className={((fs === 'second') ? 'active' : '')} id="second" onClick={() => changeFontSize(ACC.FONT_SIZES.MEDIUM)}>A</span>
        <span className={((fs === 'third') ? 'active' : '')} id="third" onClick={() => changeFontSize(ACC.FONT_SIZES.LARGE)}>A</span>
      </div>
    </li>
  );
}

export default FontSizeChangers;
