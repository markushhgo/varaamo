import APP from 'constants/AppConstants';

function isLargerFontSizeSelector(state) {
  return state.ui.accessibility.fontSize !== APP.FONT_SIZES.SMALL;
}

const contrastSelector = state => (state.ui.accessibility.isHighContrast ? 'high-contrast' : '');

export {
  isLargerFontSizeSelector,
  contrastSelector
};
