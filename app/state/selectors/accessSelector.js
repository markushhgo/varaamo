
export const contrastSelector = state => state.acc.contrast;

function toggleContrast(state) {
  return Boolean(state.acc.contrast);
}

export { toggleContrast };
