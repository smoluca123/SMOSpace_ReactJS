/* eslint-disable @typescript-eslint/no-explicit-any */
import baseApi from '@/apis/baseApi';
import { IApiResponseWrapper, IUserWithAccessTokenType } from '@/lib/types';
import { LoginValues, RegisterValues } from '@/lib/validations';

export const loginAPI = async (
  credentials: LoginValues
): Promise<IApiResponseWrapper<IUserWithAccessTokenType>> => {
  try {
    const { data } = await baseApi.post<
      IApiResponseWrapper<IUserWithAccessTokenType>
    >('/auth/login', credentials);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};

export const registerAPI = async (
  credentials: RegisterValues
): Promise<IApiResponseWrapper<IUserWithAccessTokenType>> => {
  try {
    const { data } = await baseApi.post<
      IApiResponseWrapper<IUserWithAccessTokenType>
    >('/auth/register', credentials);
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message;
    throw error.message;
  }
};
