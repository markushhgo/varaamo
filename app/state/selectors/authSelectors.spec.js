import User from 'utils/fixtures/User';
import { getState } from 'utils/testUtils';
import {
  authUserSelector,
  currentUserSelector,
  isAdminSelector,
  isSuperUserSelector,
  isManagerForSelector,
  isLoadingUserSelector,
  isLoggedInSelector,
  staffUnitsSelector,
  loginExpiresAtSelector,
  hasStrongAuthSelector,
  authUserAmrSelector,
  createIsAdminForResourceSelector,
  createIsManagerForResourceSelector,
  userAdminResourceOrderSelector,
} from './authSelectors';
import Resource from '../../utils/fixtures/Resource';

describe('state/selectors/authSelectors', () => {
  describe('authUserSelector', () => {
    test('returns user', () => {
      const user = { profile: {} };
      const state = getState({ auth: { user } });
      expect(authUserSelector(state)).toEqual(user);
    });
  });

  describe('currentUserSelector', () => {
    function getSelected(extraState) {
      const state = getState(extraState);
      return currentUserSelector(state);
    }

    test('returns user corresponding to the auth.userId', () => {
      const user = User.build();
      const selected = getSelected({
        auth: {
          user: {
            profile: {
              sub: user.id
            },
          },
        },
        'data.users': { [user.id]: user },
      });
      expect(selected).toEqual(user);
    });

    test('returns an empty object if logged in user data does not exist', () => {
      const selected = getSelected({
        auth: {
          user: {
            profile: {
              sub: 'u-999'
            },
          },
        },
      });
      expect(selected).toEqual({});
    });

    test('returns an empty object if user is not logged in', () => {
      const user = User.build();
      const selected = getSelected({
        auth: { user: null },
        'data.users': { [user.id]: user },
      });
      expect(selected).toEqual({});
    });
  });

  describe('isAdminSelector', () => {
    function getSelected(user = {}) {
      const state = getState({
        auth: {
          user: {
            profile: {
              sub: user.id
            }
          }
        },
        'data.users': { [user.id]: user },
      });
      return isAdminSelector(state);
    }

    test('returns false if user is not logged in', () => {
      const user = {};
      expect(getSelected(user)).toBe(false);
    });

    test('returns false if user.isStaff is false', () => {
      const user = { id: 'u-1', isStaff: false };
      expect(getSelected(user)).toBe(false);
    });

    test('returns true if user.isStaff is true', () => {
      const user = { id: 'u-1', isStaff: true };
      expect(getSelected(user)).toBe(true);
    });
  });

  describe('isSuperUserSelector', () => {
    function getSelected(user = {}) {
      const state = getState({
        auth: {
          user: {
            profile: {
              sub: user.id
            }
          }
        },
        'data.users': { [user.id]: user },
      });
      return isSuperUserSelector(state);
    }
    test('return true if user is superuser', () => {
      const user = { id: 'u-1', isStaff: true, staffStatus: { isSuperuser: true } };
      expect(getSelected(user)).toBe(true);
    });

    test('return false if user is not superuser', () => {
      const user = { id: 'u-1', isStaff: true, staffStatus: { } };
      expect(getSelected(user)).toBe(false);
    });
  });

  describe('isManagerForSelector', () => {
    function getSelected(user = {}) {
      const state = getState({
        auth: {
          user: {
            profile: {
              sub: user.id
            }
          }
        },
        'data.users': { [user.id]: user },
      });
      return isManagerForSelector(state);
    }
    test('returns empty array if user isnt manager for any units', () => {
      const user = { id: 'u-1' };
      expect(getSelected(user)).toStrictEqual([]);
    });

    test('returns array of unit ids where user is manager', () => {
      const units = ['unit-1', 'unit-2', 'unit-3'];
      const user = { id: 'u-1', staffStatus: { isManagerFor: units } };

      expect(getSelected(user)).toStrictEqual(units);
    });
  });

  describe('isLoadingUserSelector', () => {
    test('returns bool isLoadingUser', () => {
      const isLoadingUser = true;
      const state = getState({ auth: { isLoadingUser } });
      expect(isLoadingUserSelector(state)).toEqual(isLoadingUser);
    });
  });

  describe('hasStrongAuthSelector', () => {
    function getSelected(user = {}) {
      const state = getState({
        auth: {
          user: {
            profile: {
              sub: user.id
            }
          }
        },
        'data.users': { [user.id]: user },
      });
      return hasStrongAuthSelector(state);
    }

    test('returns true when user has strong auth', () => {
      const user = { id: 'u-1', isStrongAuth: true };
      expect(getSelected(user)).toBe(true);
    });

    test('returns false when user does not have strong auth', () => {
      const user = { id: 'u-1', isStrongAuth: false };
      expect(getSelected(user)).toBe(false);
    });
  });

  describe('isLoggedInSelector', () => {
    function getSelected({ user }) {
      const state = getState({ auth: { user } });
      return isLoggedInSelector(state);
    }

    test('returns true if user is defined', () => {
      expect(getSelected({ user: {} })).toBe(true);
    });
  });

  describe('loginExpiresAtSelector', () => {
    function getSelected({ user }) {
      const state = getState({ auth: { user } });
      return loginExpiresAtSelector(state);
    }
    test('returns expires at value if user exists', () => {
      expect(getSelected({ user: { expires_at: 1612853993 } })).toBe(1612853993);
    });

    test('returns null if user does not exist', () => {
      expect(getSelected({ user: undefined })).toBe(null);
    });
  });

  describe('staffUnitsSelector', () => {
    function getSelected(user) {
      const state = {
        auth: {
          user: {
            profile: {
              sub: user.id
            },
          },
        },
        data: {
          users: { [user.id]: user },
        },
      };
      return staffUnitsSelector(state);
    }

    test(
      'returns unit ids where user has can_approve_reservation permission',
      () => {
        const user = User.build({
          staffPerms: {
            unit: {
              'unit-1': ['can_approve_reservation'],
              'unit-2': ['can_approve_reservation'],
            },
          },
        });
        const selected = getSelected(user);
        const expected = ['unit-1', 'unit-2'];

        expect(selected).toEqual(expected);
      }
    );

    test(
      'does not return unit ids where user does not have can_approve_reservation permission',
      () => {
        const user = User.build({
          staffPerms: {
            unit: {
              'unit-1': ['can_approve_something_else'],
              'unit-2': ['can_approve_reservation'],
              'unit-3': [],
            },
          },
        });
        const selected = getSelected(user);
        const expected = ['unit-2'];

        expect(selected).toEqual(expected);
      }
    );

    test('returns an empty array if user has no staff permissions', () => {
      const user = User.build();
      const selected = getSelected(user);

      expect(selected).toEqual([]);
    });

    test(
      'returns an empty array if user has no staff permissions for units',
      () => {
        const user = User.build({
          staffPerms: {
            unit: {},
          },
        });
        const selected = getSelected(user);

        expect(selected).toEqual([]);
      }
    );
  });

  describe('createIsAdminForResourceSelector', () => {
    test('returns true if user has unit admin perm for resource', () => {
      const resource = Resource.build({
        userPermissions: {
          isAdmin: true,
        },
      });
      const resourceSelector = () => resource;
      const state = getState({
        'data.resources': { [resource.id]: resource }
      });
      expect(createIsAdminForResourceSelector(resourceSelector)(state)).toEqual(true);
    });

    test('returns false if user doesnt not have unit admin perm for resource', () => {
      const resource = Resource.build({
        userPermissions: {
          isAdmin: false,
        },
      });
      const resourceSelector = () => resource;
      const state = getState({
        'data.resources': { [resource.id]: resource }
      });
      expect(createIsAdminForResourceSelector(resourceSelector)(state)).toEqual(false);
    });
  });

  describe('createIsManagerForResourceSelector', () => {
    test('returns true if user has unit manager perm for resource', () => {
      const resource = Resource.build({
        userPermissions: {
          isManager: true,
        },
      });
      const resourceSelector = () => resource;
      const state = getState({
        'data.resources': { [resource.id]: resource }
      });
      expect(createIsManagerForResourceSelector(resourceSelector)(state)).toEqual(true);
    });

    test('returns false if user doesnt not have unit manager perm for resource', () => {
      const resource = Resource.build({
        userPermissions: {
          isManager: false,
        },
      });
      const resourceSelector = () => resource;
      const state = getState({
        'data.resources': { [resource.id]: resource }
      });
      expect(createIsManagerForResourceSelector(resourceSelector)(state)).toEqual(false);
    });
  });

  describe('authUserAmrSelector', () => {
    test('returns user profile amr value if it exists', () => {
      const amr = 'test-amr-1';
      const user = { profile: { amr } };
      const state = getState({ auth: { user } });
      expect(authUserAmrSelector(state)).toEqual(amr);
    });

    test('returns empty string if amr value does not exist', () => {
      const user = { profile: { } };
      const state = getState({ auth: { user } });
      expect(authUserAmrSelector(state)).toEqual('');
    });
  });

  describe('userAdminResourceOrderSelector', () => {
    function getSelected(user) {
      return getState({
        auth: {
          user: {
            profile: {
              sub: user.id
            },
          },
        },
        'data.users': { [user.id]: user },
      });
    }

    test('returns user admin resource order value if it exists', () => {
      const order = ['1', '2', '3'];
      const user = User.build({ extraPrefs: { adminResourceOrder: order } });
      const user2 = User.build({ extraPrefs: null });
      const user3 = User.build({ extraPrefs: { adminResourceOrder: [] } });
      const user4 = User.build();
      const user5 = User.build({ extraPrefs: {} });
      expect(userAdminResourceOrderSelector(getSelected(user))).toEqual(order);
      expect(userAdminResourceOrderSelector(getSelected(user2))).toEqual([]);
      expect(userAdminResourceOrderSelector(getSelected(user3))).toEqual([]);
      expect(userAdminResourceOrderSelector(getSelected(user4))).toEqual([]);
      expect(userAdminResourceOrderSelector(getSelected(user5))).toEqual([]);
    });
  });
});

