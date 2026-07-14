export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

/** Full registration payload for Parabank /register.htm. */
export interface RegistrationDetails {
  firstName: string;
  lastName: string;
  address: UserAddress;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface Credentials {
  username: string;
  password: string;
}
