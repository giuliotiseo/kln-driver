const profilesApi = require('../api/jwyAuthApi');
const authController = require("./authController");
const bcrypt = require('bcryptjs');

const handleUpdatePassword = async (req, res) => {
  const { profileId, psw } = req.body;
  if(!profileId || !psw ) return res.status(400).json({ 'message': 'Profile ID and password are required.' });

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(psw, 10);

    // update and store edit
    const updatedProfile = {
      "id": profileId,
      "psw": hashedPwd,
    };

    const results = await profilesApi.updatePsw(updatedProfile);
    if(!results?.Attributes?.psw) {
      res.status(500).json({ 'error': `Error trying to update ${profileId}`});
    } else {
      authController.handleLogin(req, res);
      // res.status(201).json({
      //   'success': `Profile ${profileId} updated!`,
      //   'data': {
      //     id: results?.Attributes?.id?.S,
      //     psw: results?.Attributes?.psw?.S,
      //   }
      // });
    }

  } catch(err) {
    res.status(500).json({ 'message': err.message });
  }
}

module.exports = { handleUpdatePassword };