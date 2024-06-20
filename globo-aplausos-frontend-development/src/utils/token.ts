import jwtDecode from 'jwt-decode';
import { AccessTokenDecoded } from '@/types/auth';

export function getToken() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return '';
  }
  return localStorage.getItem('accessToken') ?? '';
}

export function setToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function removeToken() {
  localStorage.removeItem('accessToken');
}

export function decodeToken(token: string = getToken()) {
  return jwtDecode<AccessTokenDecoded>(token);
}

export function isTokenExpired(token: string = getToken()) {
  if (!token) return true;

  const decodedToken = decodeToken(token);
  if (!decodedToken) return true;

  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
}

export function isTokenValid(token: string = getToken()) {
  return !isTokenExpired(token);
}