const profilesApi = require('../api/jwyAuthApi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const handleLogin = async(req,res) => {
  const cookies = req.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
  const { profileId, psw } = req.body;
  if(!profileId || !psw) return res.status(400).json({ 'message': 'Profile ID and password are required.' }); // Bad Request
  
  // Search profile
  const foundProfile = await profilesApi.get(profileId);

  if(!foundProfile || !foundProfile?.psw) return res.sendStatus(401); // Unauthorized
  // evaluate password
  const match = await bcrypt.compare(psw, foundProfile.psw);
  if(match) {
    // Create JWTs
    const accessToken = jwt.sign(
      { 
        "UserInfo": {
          "id": foundProfile.id,
          "roleIds": foundProfile.roleIds
        },
      },
      process.env.ACCESSTOKEN,
      { expiresIn: '10s' }
    );

    const newRefreshToken = jwt.sign(
      { 'id': foundProfile.id },
      process.env.REFRESHTOKEN,
      { expiresIn: '1d' }
    );

    const currentRefreshToken = foundProfile?.refreshTokens || [];

    const newRefreshTokenArray = !cookies?.jwt 
        ? currentRefreshToken
        : currentRefreshToken.filter(rt => rt !== cookies.jwt);
    
    if(cookies?.jwt) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }); // aggiungi secure: true quando si va in produzione    
    }

    // Saving refreshToken with current profile
    foundProfile.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
    console.log("vedo i refreshtoken in authcontroller", foundProfile.refreshTokens);
    const result = await profilesApi.updateRefreshToken(foundProfile);
    console.log("Refresh token aggiornato", result);


    // Creates Secure Cookie with refresh token
    res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

    res.json({
      accessToken,
      roleIds: foundProfile.roleIds?.length > 0
        ? foundProfile.roleIds.map(raw_role => parseInt(raw_role))
        : []
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
}

module.exports = { handleLogin };