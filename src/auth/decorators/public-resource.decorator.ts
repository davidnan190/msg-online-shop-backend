import { IS_PUBLIC_RESOURCE_TAG } from "../constants/auth.constants";
import { SetMetadata } from "@nestjs/common";

export const PublicResource = () => SetMetadata(IS_PUBLIC_RESOURCE_TAG, true);
