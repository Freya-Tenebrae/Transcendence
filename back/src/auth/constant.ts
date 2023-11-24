import { SetMetadata } from '@nestjs/common';

export const jwtConstant = {
	secret: process.env.JWT_CONSTANT
  };

export const clientidConstant = {
	secret: process.env.VITE_CLIENT_ID
  };

export const clientSecretConstant = {
	secret: process.env.CLIENT_SECRET
  };

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);