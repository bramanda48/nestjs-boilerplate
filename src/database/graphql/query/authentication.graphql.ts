import { gql } from "@apollo/client/core";

/**
 * Query
 */
export const ProfileQuery = gql`
    query Profile {
        profile {
            id
            email
            email_verified
            given_name
            family_name
            middle_name
            nickname
            preferred_username
            picture
            signup_methods
            gender
            birthdate
            phone_number
            phone_number_verified
            roles
            created_at
            updated_at
        }
    }
`;

/**
 * Mutation
 */
export const ValidateJwtTokenQuery = gql`
    query ValidateJwtToken($param: ValidateJWTTokenInput!) {
        validate_jwt_token(params: $param) {
            is_valid
        }
    }
`;