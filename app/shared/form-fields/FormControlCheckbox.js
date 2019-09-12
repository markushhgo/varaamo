import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';

import InfoPopover from 'shared/info-popover';

function FormControlCheckbox({
  controlProps = {}, help, id, info, label, validationState
}) {
  return (
    <FormGroup controlId={id} validationState={validationState}>
      <Col componentClass={ControlLabel} sm={3}>
        {label}
        {' '}
        {info && <InfoPopover id={`${id}-info`} placement="right" text={info} />}
      </Col>
      <Col sm={9}>
        <RBCheckbox {...controlProps} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </Col>
    </FormGroup>
  );
}

FormControlCheckbox.propTypes = {
  controlProps: PropTypes.object,
  help: PropTypes.string,
  id: PropTypes.string.isRequired,
  info: PropTypes.string,
  label: PropTypes.string.isRequired,
  validationState: PropTypes.string,
};

export default FormControlCheckbox;
