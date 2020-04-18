export interface JwtPayload {
  uuid: string;
  handle: string;
  email: string;
  name: string;
  avatar: string;
  location: string;
  birthdate: Date;
}
