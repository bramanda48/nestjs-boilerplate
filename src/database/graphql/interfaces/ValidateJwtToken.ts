/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ValidateJWTTokenInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: ValidateJwtToken
// ====================================================

export interface ValidateJwtToken_validate_jwt_token {
  __typename: "ValidateJWTTokenResponse";
  is_valid: boolean;
}

export interface ValidateJwtToken {
  validate_jwt_token: ValidateJwtToken_validate_jwt_token;
}

export interface ValidateJwtTokenVariables {
  param: ValidateJWTTokenInput;
}
