import http from 'k6/http';
import { check, fail } from 'k6';
import { login, useSession } from './lib/auth';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';
const username = __ENV.TEST_USER_USERNAME;
const password = __ENV.TEST_USER_PASSWORD;

export const options = {
  vus: 1,
  iterations: 1,
};

export default function () {
  if (!username || !password) {
    fail('TEST_USER_USERNAME and TEST_USER_PASSWORD are required.');
  }

  const session = login(BASE_URL, { username, password });
  useSession(BASE_URL, session.sessionId);

  const jar = http.cookieJar();
  const cookies = jar.cookiesForURL(`${BASE_URL}/auth/profile`);

  check(cookies, {
    'session cookie is stored': (storedCookies) =>
      storedCookies['connect.sid']?.length > 0,
  });

  const profile = http.get(`${BASE_URL}/auth/profile`);

  check(profile, {
    'profile is authenticated': (response) =>
      response.status === 200 && response.json('data.isAuthenticated') === true,
  });
}
