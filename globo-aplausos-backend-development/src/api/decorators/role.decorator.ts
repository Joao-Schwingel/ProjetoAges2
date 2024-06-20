import { SetMetadata } from '@nestjs/common';

export const IS_BASIC_KEY = 'isBasic';
export const IS_ADMIN_KEY = 'isAdmin';
export const IsBasic = () => SetMetadata(IS_BASIC_KEY, true);
export const IsAdmin = () => SetMetadata(IS_ADMIN_KEY, true);
