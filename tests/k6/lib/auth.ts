import http from 'k6/http';
import { check } from 'k6';

type Credentials = {
  username: string;
  password: string;
};

export type Session = {
  sessionId: string;
};

export function login(baseUrl: string, credentials: Credentials): Session {
  const response = http.post(
    `${baseUrl}/auth/login`,
    JSON.stringify(credentials),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  const sessionId = response.cookies['connect.sid']?.[0]?.value;
  const succeeded = check(response, {
    'login succeeds': (result) => result.status === 201,
    'session cookie is returned': () => Boolean(sessionId),
  });

  if (!succeeded || !sessionId) {
    throw new Error(`Login failed: status=${response.status}`);
  }

  return { sessionId };
}

export function useSession(baseUrl: string, sessionId: string) {
  const jar = http.cookieJar();
  jar.set(baseUrl, 'connect.sid', sessionId);
}
