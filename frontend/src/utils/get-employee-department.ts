export const getEmployeeDepartment = (orgTree: string) => {
  const n = orgTree.lastIndexOf('|');
  return orgTree.substring(n + 1);
};
