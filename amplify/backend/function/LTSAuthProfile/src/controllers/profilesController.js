const data = {
  profiles: require('../models/profiles.json'),
  setProfiles: function(data) { this.profiles = data }
};

const getAllProfiles = (req, res) => {
  res.json(data.profiles)
};

const updateProfile = (req, res) => {
  const profile = data.profiles.find(prof => prof.id === req.body.id);
  if(!profile) {
    return res.status(400).json({ "message": `Profile ID ${req.body.id} not found`});
  }

  if(req.body.name) profile.name = req.body.name;
  if(req.body.surname) profile.surname = req.body.surname;
  if(req.body.email) profile.email = req.body.email;

  const filteredArray = data.profiles.filter(prof => prof.id !== req.body.id);
  const unsortedArray = [...filteredArray, profile ];
  data.setProfiles(unsortedArray);
  res.json(data.profiles);
}

const deleteProfile = (req, res) => {
  const profile = data.profiles.find(prof => prof.id === req.body.id);
  if(!profile) {
    return res.status(400).json({ "message": `Profile ID ${req.body.id} not found`});
  }

  const filteredArray = data.profiles.filter(prof => prof.id !== req.body.id);
  data.setProfiles([...filteredArray ]);
  res.json(data.profiles);
}

module.exports = {
  getAllProfiles,
  updateProfile,
  deleteProfile,
}