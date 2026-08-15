export interface AuthUser {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  readonly fullName: string;
}

export interface LoginResponse {
  readonly data: {
    readonly user: AuthUser;
  };
}
