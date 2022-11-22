// Create --------------------------------------------------------------------------------------------------------------------------------
export const addProfileToCompanyFormatter = (params) => {
    return {
      input: {
        ...params,
        username: params.email,
        searchable: `${params.name.toLowerCase()} ${params.surname.toLowerCase()}`,
        // refreshTokens: ["NO_TOKEN"]
      }
    }
  }
  
  // Update --------------------------------------------------------------------------------------------------------------------------------
  export const updateProfileInCompanyFormatter = (params) => {
    return {
      input: {
        id: params.id,
        username: params.email,
        avatar: params?.avatar,
        tenant: params.tenant,
        fiscalCode: params.fiscalCode,
        name: params.name,
        surname: params.surname,
        roleIds: params.roleIds,
        searchable: `${params.name.toLowerCase()} ${params.surname.toLowerCase()}`,
      }
    }
  }
  
  
  // Delete --------------------------------------------------------------------------------------------------------------------------------
  export const removeProfileFromCompanyFormatter = (params) => {
    return {
      input: { id: params.id }
    }
  }
  