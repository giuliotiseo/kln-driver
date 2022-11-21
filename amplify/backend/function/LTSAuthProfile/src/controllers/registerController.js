const profilesApi = require('../api/jwyAuthApi');
const bcrypt = require('bcryptjs');

const handleNewProfile = async (req, res) => {
  const { profileId, psw, email, name, fiscalCode, phone, companyId, roleIds, owner } = req.body;
  if(!profileId || !psw ) return res.status(400).json({ 'message': 'Profile ID and password are required.' });
  if(!email || !name || !surname ) return res.status(400).json({ 'message': 'Name, surname and email are required.' });
  if(!companyId || !roleIds?.[0] || !owner ) return res.status(400).json({ 'message': 'CompanyId, roleIds and owner are required.' });
  
  // check for duplicate ids in the db
  const profiles = await profilesApi.list(companyId);
  console.log("Existent profiles", profiles);

  const duplicate = profiles.find(profileFromDb => profileFromDb.id === profileId);
  if(duplicate) return res.sendStatus(409); // Conflict

  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(psw, 10);

    // create and store the new profile
    const newProfile = {
      "id": profileId,
      "psw": hashedPwd,
      "email": email,
      "name": name,
      "surname": email,
      "searchable": `${name.toLowerCase()} ${surname.toLowerCase()}`,
      "fiscalCode": fiscalCode,
      "phone": phone,
      "companyId": companyId,
      "roleIds": roleIds,
      "owner": owner,
    };

    const results = await profilesApi.create(newProfile);
    if(!results?.Item?.id) {
      res.status(500).json({ 'error': `Error trying to create ${profileId}`});
    } else {
      res.status(201).json({ 'success': `New profile ${profileId} created!`});
    }

  } catch(err) {
    res.status(500).json({ 'message': err.message });
  }
}

module.exports = { handleNewProfile };