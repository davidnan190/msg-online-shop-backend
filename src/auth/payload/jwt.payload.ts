import { Role } from "src/customers/enum/role.enum";

export interface JwtPayload {
  readonly sub: string;
  readonly username: string;
  readonly emailAddress: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: Role;
}
