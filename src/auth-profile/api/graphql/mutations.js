export const CREATE_PROFILE = /* GraphQL */ `
  mutation CreateProfile(
    $input: CreateProfileInput!
    $condition: ModelProfileConditionInput
  ) {
    createProfile(input: $input, condition: $condition) {
      id
      username
      fiscalCode
      email
      searchable
      name
      surname
      phone
      avatar {
        filename
        identityId
        bucket
        region
        key
        extension
        timestamp
      }
      deviceId
      tenant
      company {
        id
        companyCode
        vatNumber
        name
        fiscalCode
        city
        address
        uniqueCode
        pec
        emails {
          name
          value
        }
        phones {
          name
          value
        }
        logo {
          filename
          identityId
          bucket
          region
          key
          extension
          timestamp
        }
        trades
        profiles {
          nextToken
        }
        log {
          authorId
          author
          description
          timestamp
        }
        type
        createdAt
        updatedAt
      }
      roleIds
      psw
      note
      log {
        authorId
        author
        description
        timestamp
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROFILE = /* GraphQL */ `
mutation UpdateProfile(
  $input: UpdateProfileInput!
  $condition: ModelProfileConditionInput
) {
  updateProfile(input: $input, condition: $condition) {
    id
    username
    fiscalCode
    email
    searchable
    name
    surname
    phone
    avatar {
      filename
      identityId
      bucket
      region
      key
      extension
      timestamp
    }
    deviceId
    tenant
    company {
      id
      companyCode
      vatNumber
      name
      fiscalCode
      city
      address
      uniqueCode
      pec
      emails {
        name
        value
      }
      phones {
        name
        value
      }
      logo {
        filename
        identityId
        bucket
        region
        key
        extension
        timestamp
      }
      trades
      profiles {
        nextToken
      }
      log {
        authorId
        author
        description
        timestamp
      }
      type
      createdAt
      updatedAt
    }
    roleIds
    psw
    note
    log {
      authorId
      author
      description
      timestamp
    }
    createdAt
    updatedAt
  }
}
`;

export const DELETE_PROFILE = /* GraphQL */ `
  mutation DeleteProfile(
    $input: DeleteProfileInput!
  ) {
    deleteProfile(input: $input) {
      id
      searchable
    }
  }
`;