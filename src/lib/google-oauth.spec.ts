import test from 'ava';

import test_config from '../test.env.json';

import { getAuthToken, verifyIdToken } from './google-oauth';

const credentials = test_config.FIREBASE_TEST_CREDENTIALS;

test('should return an auth token from google', async (t) => {
  const token = await getAuthToken(
    credentials.serviceAccountEmail,
    credentials.privateKey,
    'https://www.googleapis.com/auth/identitytoolkit'
  );

  t.not(token, undefined);
});

test('should not verify idToken because invalid', async (t) => {
  await verifyIdToken(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdGVzdC1wcm9qZWN0LWlkIiwiYXVkIjoic2RzZHNkc2RzZCIsImF1dGhfdGltZSI6MTY1NTkyNDcxNCwidXNlcl9pZCI6InNkc2RzZHNkc2RzZCIsInN1YiI6InNkc2RzZHNkIiwiaWF0IjoxNjU1OTI0NzE0LCJleHAiOjE2NTU5MjgzMTQsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdEBlbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.3PkmhTW1LaP3lGPnBat2N770TqEE026Xhp2whzbltJo'
  ).catch((e) => {
    if (e.code) {
      t.is(e.code, 'ERR_JWT_EXPIRED');
    } else {
      t.is(e.message, '"x509" must be X.509 formatted string');
    }
  });
});
