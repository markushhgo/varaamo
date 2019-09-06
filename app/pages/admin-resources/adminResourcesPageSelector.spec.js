import moment from 'moment';

import { getState } from 'utils/testUtils';
import adminResourcesPageSelector from './adminResourcesPageSelector';

describe('pages/admin-resources/adminResourcesPageSelector', () => {
  function getSelected(extraState) {
    const state = getState(extraState);
    return adminResourcesPageSelector(state);
  }

  test('returns isAdmin', () => {
    expect(getSelected().isAdmin).toBeDefined();
  });

  test('returns isFetchingResources', () => {
    expect(getSelected().isFetchingResources).toBeDefined();
  });

  test('returns resources', () => {
    expect(getSelected().resources).toBeDefined();
  });

  test('returns selectedResourceTypes', () => {
    expect(getSelected().selectedResourceTypes).toBeDefined();
  });

  test('returns resourceTypes', () => {
    expect(getSelected().resourceTypes).toBeDefined();
  });

  test('returns contrast', () => {
    expect(getSelected().contrast).toBeDefined();
  });

  test('returns minPeriod', () => {
    expect(getSelected().minPeriod).toBeDefined();
  });

  test('returns maxPeriod', () => {
    expect(getSelected().maxPeriod).toBeDefined();
  });

  test('returns date', () => {
    const selected = getSelected({ 'ui.pages.adminResources': { date: '2017-02-01' } });
    expect(selected.date).toBe('2017-02-01');
  });

  test('returns current date by default', () => {
    const current = moment().format('YYYY-MM-DD');
    expect(getSelected().date).toBe(current);
  });

  test('returns an array of resource ids ordered by translated name', () => {
    const resource1 = { id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' } };
    const resource2 = { id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' } };
    const resource3 = { id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' } };
    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
      },
      'intl.locale': 'fi',
      'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
    };
    const expected = [3, 1];
    const selected = getSelected(extraState);
    expect(selected.resources).toEqual(expected);
  });

  test('returns an array of resourceTypes', () => {
    const resource1 = { id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' } };
    const resource2 = { id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' } };
    const resource3 = { id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' } };
    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
      },
      'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
    };
    const expected = ['school', 'printer'];
    const selected = getSelected(extraState);
    expect(selected.resourceTypes).toEqual(expected);
  });

  test(
    'returns an array of selectedResourceTypes and filtered resourceIds',
    () => {
      const resource1 = { id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' } };
      const resource2 = { id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' } };
      const resource3 = { id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' } };
      const extraState = {
        'data.resources': {
          [resource1.id]: resource1,
          [resource2.id]: resource2,
          [resource3.id]: resource3,
        },
        'ui.pages.adminResources.selectedResourceTypes': ['school'],
        'ui.pages.adminResources.resourceIds': [resource1.id, resource3.id],
      };
      const selected = getSelected(extraState);
      expect(selected.selectedResourceTypes).toEqual(['school']);
      expect(selected.resources).toEqual([1]);
    }
  );

  test(
    'returns an object of minPeriod',
    () => {
      const minTime = { resourceIdFirst: '01:00:00', resourceIdSecond: '02:00:00' };

      const extraState = {
        'ui.pages.adminResources.resourceMinPeriod': { resourceIdFirst: '01:00:00', resourceIdSecond: '02:00:00' }
      };

      const selected = getSelected(extraState);
      expect(selected.minPeriod).toStrictEqual(minTime);
    }
  );

  test(
    'returns an object of maxPeriod',
    () => {
      const maxTime = { resourceIdFirst: '10:00:00', resourceIdSecond: '06:00:00' };

      const extraState = {
        'ui.pages.adminResources.resourceMaxPeriod': { resourceIdFirst: '10:00:00', resourceIdSecond: '06:00:00' }
      };

      const selected = getSelected(extraState);
      expect(selected.maxPeriod).toStrictEqual(maxTime);
    }
  );
});
