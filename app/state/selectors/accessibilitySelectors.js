import APP from 'constants/AppConstants';

function isLargerFontSizeSelector(state) {
  return state.ui.accessability.fontSize !== APP.FONT_SIZES.SMALL;
}

export {
  isLargerFontSizeSelector
};
