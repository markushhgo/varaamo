import React from 'react';
import Toggle from 'react-toggle';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import CheckboxControl from './CheckboxControl';

const defaults = {
  id: 'some-id',
  label: 'some-label',
  onConfirm: () => null,
  value: true,
};
function getWrapper(props) {
  return shallowWithIntl(<CheckboxControl {...defaults} {...props} />);
}

describe('pages/search/controls/CheckboxControl', () => {
  test('renders a section.app-CheckboxControl', () => {
    const wrapper = getWrapper({});
    expect(wrapper.is('section.app-CheckboxControl')).toBe(true);
  });

  test('renders a Toggle with correct props', () => {
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
    const toggle = getWrapper({}).find(Toggle);
    expect(toggle).toHaveLength(1);
    expect(toggle.prop('icons')).toEqual({ unchecked: unCheckedIcon, checked: checkedIcon });
    expect(toggle.prop('checked')).toBe(defaults.value);
    expect(typeof toggle.prop('onChange')).toBe('function');
  });

  test('Checkbox onChange calls prop onConfirm', () => {
    const onConfirm = simple.mock();
    const mockEvent = {
      target: {
        checked: true,
      },
    };
    const toggle = getWrapper({ onConfirm }).find(Toggle);
    expect(toggle).toHaveLength(1);
    toggle.prop('onChange')(mockEvent);
    expect(onConfirm.callCount).toBe(1);
    expect(onConfirm.lastCall.args).toEqual([true]);
  });
});
