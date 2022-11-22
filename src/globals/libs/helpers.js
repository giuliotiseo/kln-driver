// Formatters -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
export const replaceSpaceWithDash = (inputString) => {
  return inputString.replace(/\s+/g, '-').toLowerCase()
}

export const removeSpacesFromString = (inputString) => {
  return inputString.replace(/\s/g,'')
}

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const capitalizeFullName = str => {
  return str.split(" ").map(seg => capitalize(seg)).join(" ")
}

export const forcedCapitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();