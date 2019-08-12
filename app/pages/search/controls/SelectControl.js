import PropTypes from 'prop-types';
import React from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Select from 'react-select';
import isArray from 'lodash/isArray';
import classNames from 'classnames';

import { injectT } from 'i18n';

class SelectControl extends React.Component {
  getValue = (value, options) => {
    if (isArray(value)) {
      return value.map(item => options.find(option => option.value === item));
    }

    const foundValue = options.find(option => option.value === value);
    if (foundValue === undefined) {
      return '';
    }

    return foundValue;
  };

  noOptionsMessage = () => this.props.t('SelectControl.noOptions')

  render() {
    const {
      id,
      className,
      isLoading = false,
      isClearable = true,
      isSearchable = true,
      isMulti,
      label,
      onChange,
      options,
      t,
      value,
      ...rest
    } = this.props;
    return (
      <section aria-label={label} className="app-SelectControl">
        <FormGroup controlId={id}>
          {label && <ControlLabel>{label}</ControlLabel>}
          {!isLoading
            && (
            <Select
              {...rest}
              className={classNames('app-Select', className)}
              classNamePrefix="app-Select"
              inputId={id}
              isClearable={isClearable}
              isMulti={isMulti}
              isSearchable={isSearchable}
              noOptionsMessage={this.noOptionsMessage}
              onChange={(selected, { action }) => {
                switch (action) {
                  case 'clear':
                    onChange(isMulti ? [] : {}, action);
                    break;
                  default:
                    if (!selected && isMulti) {
                      onChange([], selected);
                    } else if (!selected && !isMulti) {
                      onChange({}, action);
                    } else {
                      onChange(selected, action);
                    }
                    break;
                }
              }}
              options={options}
              placeholder={t('common.select')}
              value={this.getValue(value, options)}
            />
            )}
        </FormGroup>
      </section>
    );
  }
}
SelectControl.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  isLoading: PropTypes.bool,
  isMulti: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
};

export default injectT(SelectControl);
