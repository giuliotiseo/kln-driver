const express = require('express');
const router = express.Router();
const profilesController = require("../../controllers/profilesController");
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
  .get(profilesController.getAllProfiles)
  .put(verifyRoles(ROLES_LIST.ADMIN), profilesController.updateProfile)
  .delete(verifyRoles(ROLES_LIST.ADMIN), profilesController.deleteProfile)

module.exports = router;