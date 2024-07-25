import { ALLOWED_ROLES_TAG } from '../constants/auth.constants';
import { Role } from 'src/customers/enum/role.enum';
import { SetMetadata } from '@nestjs/common';

export const AllowedRoles = (...allowedRoles: Role[]) =>
  SetMetadata(ALLOWED_ROLES_TAG, allowedRoles);
