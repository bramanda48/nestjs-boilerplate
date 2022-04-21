/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Profile
// ====================================================

export interface Profile_profile {
  __typename: "User";
  id: string;
  email: string;
  email_verified: boolean;
  given_name: string | null;
  family_name: string | null;
  middle_name: string | null;
  nickname: string | null;
  preferred_username: string | null;
  picture: string | null;
  signup_methods: string;
  gender: string | null;
  birthdate: string | null;
  phone_number: string | null;
  phone_number_verified: boolean | null;
  roles: string[];
  created_at: any | null;
  updated_at: any | null;
}

export interface Profile {
  profile: Profile_profile;
}
