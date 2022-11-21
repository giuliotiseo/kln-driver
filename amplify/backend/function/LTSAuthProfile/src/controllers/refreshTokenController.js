const profilesApi = require('../api/jwyAuthApi');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req,res) => {
  const { companyId } = req.body;

  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }); // aggiungi secure: true quando si va in produzione
  
  console.log("Vedi companyId", companyId);
  
  // Search profile
  const foundProfiles = await profilesApi.list(companyId);
  console.log("FOUND PROFILES - ", foundProfiles);
  const foundProfile = foundProfiles.filter(profile => profile.refreshTokens.includes(refreshToken))?.[0];
  console.log("FOUND PROFILE - ", foundProfile);

  // Detected refresh token reuse!
  if(!foundProfile) {
    jwt.verify(
      refreshToken,
      process.env.REFRESHTOKEN,
      async (err, decoded) => {
        if(err) return res.sendStatus(403); // Forbidden
        const hackedProfile = await profilesApi.get(decoded.id); // decoded: decodifica il token per ottenere l'id del profilo
        hackedProfile.refreshTokens = [];
        const result = await profilesApi.updateRefreshToken({ ...hackedProfile });
        console.log(result);
      }
    )

    return res.sendStatus(403); // Forbidden
  }

  const newRefreshTokenArray = foundProfile.refreshTokens.filter(rt => rt !== refreshToken);

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESHTOKEN,
    async (err, decoded) => {
      if(err) {
        console.log("Attempted refresh token reuse");
        foundProfile.refreshTokens = [...newRefreshTokenArray];
        const result = await profilesApi.updateRefreshToken(foundProfile);
        console.log("Result in refreshtokencontroller", result)
      }

      if(err || foundProfile.id !== decoded.id) {
        return res.sendStatus(403);
      };
      
      // Refresh token was still valid
      const roleIds = foundProfile.roleIds;
      const accessToken = jwt.sign(
        { 
          "UserInfo": {
            "id": decoded.id,
            "roleIds": roleIds
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
  
      // Saving refreshToken with current profile
      foundProfile.refreshTokens = [...newRefreshTokenArray, newRefreshToken ]
      const result = await profilesApi.updateRefreshToken(foundProfile);
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
        secure: true // aggiungi secure: true in produzione
      });

      res.json({
        profileId: foundProfile.id,
        accessToken,
        roleIds: foundProfile.roleIds?.length > 0
          ? foundProfile.roleIds
          : []
      });
    }
  )
}

module.exports = { handleRefreshToken };