import { shallow } from 'enzyme';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import InfoPopover from 'shared/info-popover';
import FormControlCheckbox from './FormControlCheckbox';

describe('shared/form-fields/FormControlCheckbox', () => {
  const defaultProps = {
    controlProps: { someProp: 'some', otherProp: 'other' },
    id: 'requireAssistance',
    label: 'I require guidance',
    type: 'checkbox',
    validationState: 'error',
  };

  function getWrapper(props) {
    return shallow(<FormControlCheckbox {...defaultProps} {...props} />);
  }

  describe('FormGroup component', () => {
    test('is rendered', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup.length).toBe(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(FormGroup).props();
      expect(actualProps.controlId).toBe(defaultProps.id);
      expect(actualProps.validationState).toBe(defaultProps.validationState);
    });
  });

  describe('Col components', () => {
    test('renders 2 Col components', () => {
      const cols = getWrapper().find(Col);
      expect(cols.length).toBe(2);
    });

    describe('the first Col', () => {
      function getColWrapper(props) {
        return getWrapper(props).find(Col).at(0);
      }

      test('gets correct props', () => {
        expect(getColWrapper().props().componentClass).toBe(ControlLabel);
        expect(getColWrapper().props().sm).toBe(3);
      });

      test('contains the label text given in props', () => {
        expect(
          getColWrapper().props().children
        ).toEqual(expect.arrayContaining([defaultProps.label]));
      });

      test('does not contain InfoPopover if info not given', () => {
        const popover = getColWrapper().find(InfoPopover);
        expect(popover).toHaveLength(0);
      });

      test('contains InfoPopover if info is given', () => {
        const info = 'Some info';
        const popover = getColWrapper({ info }).find(InfoPopover);
        expect(popover).toHaveLength(1);
        expect(popover.prop('text')).toBe(info);
      });
    });

    describe('the second Col', () => {
      let col;

      beforeAll(() => {
        col = getWrapper().find(Col).at(1);
      });

      test('gets correct props', () => {
        expect(col.props().sm).toBe(9);
      });

      test('contains React Bootstrap Checkbox', () => {
        const rbCheckbox = col.find(RBCheckbox);
        expect(rbCheckbox.length).toBe(1);
      });
    });
  });

  describe('React Bootstrap Checkbox component', () => {
    test('is rendered', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.length).toBe(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(RBCheckbox).props();
      Object.keys(defaultProps.controlProps).forEach((key) => {
        expect(actualProps[key]).toBe(defaultProps.controlProps[key]);
      });
    });
  });

  describe('HelpBlock component', () => {
    describe('if help is given in props', () => {
      const help = 'some help';

      test('is rendered', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.length).toBe(1);
      });

      test('displays the help text given in props', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.props().children).toBe(help);
      });
    });

    describe('if help is not given in props', () => {
      const help = undefined;

      test('is not rendered', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.length).toBe(0);
      });
    });
  });
});
