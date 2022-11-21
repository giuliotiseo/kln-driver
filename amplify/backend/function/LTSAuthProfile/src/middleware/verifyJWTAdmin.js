const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../config/roles_list');

const verifyJWTAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if(!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  console.log(authHeader); // Bearer token
  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESSTOKEN,
    (err, decoded) => {
      if(err) return res.sendStatus(403); // Invalid token
      req.profile = decoded.UserInfo.id;
      req.roleIds = decoded.UserInfo.roleIds;
      if(!req.roleIds?.includes(ROLES_LIST.ADMIN)) return res.sendStatus(401) // Unauthorized
      next();
    }
  )
}

module.exports = verifyJWTAdmin;