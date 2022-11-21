// Formatters
module.exports.removeSpacesFromString = (inputString) => {
  return inputString.replace(/\s/g,'')
}

// Generators
const stringGen = (len, isUpperCase) => {
  var text = "";
  var charset = isUpperCase ? "abcdefghijklmnopqrstuvwxyz".toUpperCase() : "abcdefghijklmnopqrstuvwxyz";
  for (var i = 0; i < len; i++) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return text;
}

module.exports.generateCompanyCode = (companyName) => {
  let stringCode_1 = "";
  const stringCode_2 = Math.floor(Math.random()*90000) + 10000;

  if(companyName.length <= 5) {
    if(companyName.length < 5) {
      const missings = 5 - companyName.length;
      stringCode_1 = companyName.concat(stringGen(missings));
    } else {
      stringCode_1 = companyName;
    }
  } else {
    const noSpaceName = companyName.replace(/\s+/g, '-').toLowerCase();
    const vowels = noSpaceName.match(/[AEIOU]/gi)?.length > 0 ? noSpaceName.match(/[AEIOU]/gi).join("") : "";
    const consonants = noSpaceName.match(/[BCDFGHJKLMNPQRSTVWXYZ]/gi)?.length > 0 ? noSpaceName.match(/[BCDFGHJKLMNPQRSTVWXYZ]/gi).join("") : "";
  
    if(consonants?.length >= 5) {
      stringCode_1 = consonants.slice(0,5);
    } else {
      stringCode_1 = consonants;
      const missings = 5 - consonants?.length;
      if(vowels?.length >= missings) {
        stringCode_1 = stringCode_1.concat(vowels.slice(0, missings));
      } else {
        stringCode_1 = stringCode_1.concat(stringGen(missings))
      }
    }
  }

  return `${stringCode_1.toUpperCase()}#${stringCode_2}`;
}