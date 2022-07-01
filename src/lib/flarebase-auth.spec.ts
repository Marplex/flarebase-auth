import test from 'ava';

import test_config from '../test.env.json';

import { FlarebaseAuth } from './flarebase-auth';

const credentials = test_config.FIREBASE_TEST_CREDENTIALS;
const testUser = test_config.FIREBASE_TEST_USER;
const auth = new FlarebaseAuth(credentials);

test('should sign in with email and password', async (t) => {
  const { token } = await auth.signInWithEmailAndPassword(
    testUser.email,
    testUser.password
  );

  t.is(token.email, testUser.email);
});

test('should verify a valid token id', async (t) => {
  const { token } = await auth.signInWithEmailAndPassword(
    testUser.email,
    testUser.password
  );

  const session = await auth.verifyIdToken(token.idToken);
  t.not(session, undefined);
});

test('should create session cookie from token id', async (t) => {
  const { token } = await auth.signInWithEmailAndPassword(
    testUser.email,
    testUser.password
  );

  const session = await auth.createSessionCookie(token.idToken);

  t.not(session, undefined);
});

test('should verify a valid session cookie', async (t) => {
  const { token } = await auth.signInWithEmailAndPassword(
    testUser.email,
    testUser.password
  );

  const session = await auth.createSessionCookie(token.idToken);
  const verified = await auth.verifySessionCookie(session);

  t.not(verified, undefined);
});

test('should not verify an invalid session cookie', async (t) => {
  const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGVzdC1wcm9qZWN0LWlkIiwiYXVkIjoic2RzZHNkc2RzZCIsImF1dGhfdGltZSI6MTY1NTkyNDcxNCwidXNlcl9pZCI6InNkc2RzZHNkc2RzZCIsInN1YiI6InNkc2RzZHNkIiwiaWF0IjoxNjU1OTI0NzE0LCJleHAiOjE2NTU5MjgzMTQsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBlbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.3PkmhTW1LaP3lGPnBat2N770TqEE026Xhp2whzbltJo';

  await auth.verifySessionCookie(invalidToken).catch(() => t.pass());
});
