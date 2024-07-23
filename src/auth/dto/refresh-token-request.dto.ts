import { IsJWT, IsString, IsUUID } from "class-validator";

export class RefreshTokenRequestDto {
  @IsUUID()
  customerId: string;

  @IsJWT()
  refreshToken: string
}