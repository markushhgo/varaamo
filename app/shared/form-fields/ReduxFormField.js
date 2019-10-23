import PropTypes from 'prop-types';
import React from 'react';

import Checkbox from './Checkbox';
import FormControl from './FormControl';
import FormControlCheckbox from './FormControlCheckbox';

function ReduxFormField({
  controlProps = {}, help, info, input, label, labelErrorPrefix, meta, type, altCheckbox
}) {
  const showError = meta.error && meta.touched;
  const props = {
    controlProps: Object.assign({}, input, controlProps),
    help: showError ? meta.error : help,
    id: input.name,
    info,
    label,
    labelErrorPrefix,
    type,
    validationState: showError ? 'error' : undefined,
  };

  if (type === 'checkbox') {
    if (altCheckbox) {
      return <FormControlCheckbox {...props} />;
    }

    return <Checkbox {...props} />;
  }

  return <FormControl {...props} />;
}

ReduxFormField.propTypes = {
  altCheckbox: PropTypes.bool,
  controlProps: PropTypes.object,
  help: PropTypes.string,
  info: PropTypes.string,
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  labelErrorPrefix: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default ReduxFormField;
