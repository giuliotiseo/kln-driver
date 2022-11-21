const profilesApi = require('../api/jwyAuthApi');

const handleLogOut = async (req,res) => {
  const { profileId } = req.body;
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;
  
  // Search profile
  const foundProfile = await profilesApi.get(profileId);

  // Is refreshToken in db?
  if(!foundProfile.refreshTokens.includes(refreshToken)) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }); // aggiungi secure: true quando si va in produzione
    return res.sendStatus(204); // success with no content
  }

  foundProfile.refreshTokens = foundProfile.refreshTokens.filter(rt => rt !== refreshToken);
  const result = await profilesApi.updateRefreshToken(foundProfile);
  console.log("result logout", result);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); // aggiungi quando si va in produzione: secure: true - only serves on https
  res.sendStatus(204);
}

module.exports = { handleLogOut };