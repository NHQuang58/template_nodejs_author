const allRoles = {
  black_list: [],
  user: [],
  contributor: [],
  premium: [],
  admin: [],
};

const roleLookUpTable = {
  black_list: 0,
  user: 1,
  contributor: 2,
  premium: 3,
  admin: 4,
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
  roleLookUpTable,
};
