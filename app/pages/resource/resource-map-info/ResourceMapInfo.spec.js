import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { shallowWithIntl } from 'utils/testUtils';
import ResourceMapInfo from './ResourceMapInfo';

describe('pages/resource/resource-map-info/ResourceMapInfo', () => {
  const defaultProps = {
    resource: Immutable(Resource.build()),
    unit: Immutable(
      Unit.build({
        addressZip: '12345',
        id: 'aaa',
        mapServiceId: '123',
        municipality: 'some city',
        streetAddress: 'Street address 123',
      })
    ),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourceMapInfo {...defaultProps} {...props} />);
  }

  test('renders Service map link as a Button with correct url', () => {
    const button = getWrapper().find(Button);
    const expected = 'https://palvelukartta.turku.fi/unit/123#!route-details';

    expect(button).toHaveLength(1);
    expect(button.prop('href')).toBe(expected);
    expect(button.prop('target')).toBe('_blank');
    expect(button.prop('rel')).toBe('noopener noreferrer');
  });

  test('doesnt render service map link if unit or unit.mapServiceId is missing', () => {
    const button = getWrapper({ unit: {} }).find(Button);
    expect(button).toHaveLength(0);
  });

  test('renders address text', () => {
    const { addressZip, streetAddress } = defaultProps.unit;
    const resource = Immutable(Resource.build({ distance: 11500 }));
    const expected = `${streetAddress}, ${addressZip} Some city`;
    const span = getWrapper({ resource }).find('span');

    expect(span).toHaveLength(1);
    expect(span.text()).toBe(expected);
  });
});
