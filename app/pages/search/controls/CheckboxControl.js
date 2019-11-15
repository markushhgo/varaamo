import PropTypes from 'prop-types';
import React from 'react';
import Toggle from 'react-toggle';
import classNames from 'classnames';

import { injectT } from 'i18n';

function CheckboxControl({
  id, label, labelClassName, onConfirm, toggleClassName, value
}) {
  const toggleClassNames = classNames('app-CheckboxControl__toggle', toggleClassName);
  const labelClassNames = classNames('app-CheckboxControl__label', labelClassName);
  const unCheckedIcon = (
    <svg height="10" viewBox="0 0 10 10" width="10">
      <path d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12" fill="#fff" fillRule="evenodd" />
    </svg>
  );
  const checkedIcon = (
    <svg height="11" viewBox="0 0 14 11" width="14">
      <path d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0" fill="#fff" fillRule="evenodd" />
    </svg>
  );

  return (
    <section className="app-CheckboxControl">
      <Toggle
        checked={value}
        className={toggleClassNames}
        icons={{ unchecked: unCheckedIcon, checked: checkedIcon }}
        id={id}
        onChange={e => onConfirm(e.target.checked)}
      />
      <label className={labelClassNames} htmlFor={id}>
        {label}
      </label>
    </section>
  );
}

CheckboxControl.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  toggleClassName: PropTypes.string,
  value: PropTypes.bool,
};

export default injectT(CheckboxControl);
