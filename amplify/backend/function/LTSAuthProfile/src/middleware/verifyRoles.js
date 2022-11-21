const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if(!req?.roleIds) return res.sendStatus(401);
    const rolesArray = [ ...allowedRoles ];
    console.log(rolesArray);
    console.log(req.roleIds);
    const result = req.roleIds.map(role => rolesArray.includes(role)).find(val => val === true);
    if(!result) return res.sendStatus(401);
    next();
  }
}

module.exports = verifyRoles;