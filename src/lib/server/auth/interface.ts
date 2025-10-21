export interface IForgotPasswordUserInput {
  password: string;
  email: string;
  confimPassword: string;
  otp: string;
}

export interface IForgotPassword {
 password: string;
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}