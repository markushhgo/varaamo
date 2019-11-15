import moment from 'moment';

import { getState } from 'utils/testUtils';
import adminResourcesPageSelector from './adminResourcesPageSelector';

describe('pages/admin-resources/adminResourcesPageSelector', () => {
  function getSelected(extraState) {
    const state = getState(getUser(extraState));
    return adminResourcesPageSelector(state);
  }

  function getUser(extra) {
    return {
      'auth.user.profile': {
        sub: '2019token'
      },
      'data.users.2019token': {
        staffPerms: {
          unit: {
            unitID01: [
              'can_make_reservations',
              'can_modify_reservations',
            ]
          },
        },
      },
      ...extra
    };
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

  test('returns date', () => {
    const selected = getSelected({ 'ui.pages.adminResources': { date: '2017-02-01' } });
    expect(selected.date).toBe('2017-02-01');
  });

  test('returns current date by default', () => {
    const current = moment().format('YYYY-MM-DD');
    expect(getSelected().date).toBe(current);
  });

  test('returns an array of resource ids ordered by translated name', () => {
    const resource1 = {
      id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
    };
    const resource2 = {
      id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID01'
    };
    const resource3 = {
      id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
    };
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

  test(
    'returns array of resource ids consisting of resources that are in a unit where the user has staffPermissions',
    () => {
      const resource1 = {
        id: 'resourceID01', name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
      };
      const resource2 = {
        id: 'resourceID02', name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID02'
      };
      const resource3 = {
        id: 'resourceID03', name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
      };
      const resource4 = {
        id: 'resourceID04', name: { fi: 'Dagobah' }, type: { name: 'printer' }, unit: 'unitID02'
      };

      const extraState = {
        'data.resources': {
          [resource1.id]: resource1,
          [resource2.id]: resource2,
          [resource3.id]: resource3,
          [resource4.id]: resource4,
        },
        'ui.pages.adminResources.resourceIds': [resource1.id, resource2.id, resource3.id, resource4.id],
      };
      const selected = getSelected(extraState);
      const expected = [resource3.id, resource1.id];
      expect(selected.resources).toEqual(expected);
    }
  );

  test('returns an array of resourceTypes', () => {
    const resource1 = {
      id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
    };
    const resource2 = {
      id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID01'
    };
    const resource3 = {
      id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
    };
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

  test('returns an array of resourceTypes according to user staff permissions', () => {
    const resource1 = {
      id: 'resourceID01', name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
    };
    const resource2 = {
      id: 'resourceID02', name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID02'
    };
    const resource3 = {
      id: 'resourceID03', name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
    };
    const resource4 = {
      id: 'resourceID04', name: { fi: 'Dagobah' }, type: { name: 'studio' }, unit: 'unitID01'
    };

    const extraState = {
      'data.resources': {
        [resource1.id]: resource1,
        [resource2.id]: resource2,
        [resource3.id]: resource3,
        [resource4.id]: resource4,
      },
      'ui.pages.adminResources.resourceIds': [resource1.id, resource2.id, resource3.id, resource4.id],
    };

    const selected = getSelected(extraState);
    const expected = ['school', 'printer', 'studio'];
    expect(selected.resourceTypes).toEqual(expected);
  });

  test(
    'returns an array of selectedResourceTypes and filtered resourceIds',
    () => {
      const resource1 = {
        id: 1, name: { fi: 'Tatooine' }, type: { name: 'school' }, unit: 'unitID01'
      };
      const resource2 = {
        id: 2, name: { fi: 'Dantooine' }, type: { name: 'library' }, unit: 'unitID01'
      };
      const resource3 = {
        id: 3, name: { fi: 'Alderaan' }, type: { name: 'printer' }, unit: 'unitID01'
      };
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
});
