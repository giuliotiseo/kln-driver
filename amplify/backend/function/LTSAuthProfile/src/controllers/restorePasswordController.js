const profilesApi = require('../api/jwyAuthApi');
const sendEmail = require("../api/sendEmail");
const bcrypt = require('bcryptjs');

const handleRestorePassword = async (req, res) => {
  const { profileId, email } = req.body;
  const psw = Math.random().toString(36).slice(-8);
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
      try {
        await sendEmail.send({ email, psw });
      } catch(err) {
        console.log('Invio email fallito', err);
        res.status(500).json({ 'error': `Error trying to send email to ${email}`});
      }

      res.status(201).json({
        'success': `Password for ${profileId} restored!`,
        'data': {
          id: results?.Attributes?.id,
          psw: results?.Attributes?.psw,
        }
      });
    }

  } catch(err) {
    res.status(500).json({ 'message': err.message });
  }
}

module.exports = { handleRestorePassword };