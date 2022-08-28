<h1 align="center">Flarebase Auth</h1>
<p align="center">
 Firebase/Admin Auth Javascript Library for Cloudflare Workers
</p>
<br>

<p align="center">
  <a href="https://github.com/marplex/flarebase-auth/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/marplex/flarebase-auth"/></a>
  <img src="https://github.com/marplex/flarebase-auth/actions/workflows/node_ci.yaml/badge.svg" alt="GitHub CI"/>
  <a href="https://www.npmjs.com/package/@marplex/flarebase-auth"><img alt="NPM" src="https://badge.fury.io/js/@marplex%2Fflarebase-auth.svg"/></a>
  <a href="https://www.npmjs.com/package/@marplex/flarebase-auth"><img src="https://img.shields.io/npm/dt/@marplex/flarebase-auth.svg" alt="NPM Downloads"/></a>
  <a href="https://github.com/Marplex"><img alt="Github" src="https://img.shields.io/static/v1?label=GitHub&message=marplex&color=005cb2"/></a>
</p>

# Supported operations:

- [x] createSessionCookie()
- [x] verifySessionCookie()
- [x] signInWithEmailAndPassword()
- [x] signUpWithEmailAndPassword()
- [x] changePassword()
- [x] lookupUser()

# Install

```bash
npm i @marplex/flarebase-auth
```

# Usage

Flarebase tries to use the same method names and return values as the official Firebase/Admin SDK. Sometimes, the method signature are slightly different.

**Create FlarebaseAuth**

```ts
import { FlarebaseAuth } from 'flarebase-auth';

const auth = new FlarebaseAuth({
  apiKey: 'Firebase api key',
  projectId: 'Firebase project id',
  privateKey: 'Firebase private key or service account private key',
  serviceAccountEmail: 'Firebase service account email',
});
```

**Sign-in with email/pass**

```ts
//Sign in with username and password
const { token, user } = await auth.signInWithEmailAndPassword(
  'my@email.com',
  'supersecurepassword'
);

const userEmail = user.email;
const refreshToken = token.refreshToken;
```

**Sign-up with email/pass**

```ts
//Sign up with username and password
const { token, user } = await auth.signUpWithEmailAndPassword(
  'my@email.com',
  'supersecurepassword'
);

const userEmail = user.email;
const refreshToken = token.refreshToken;
```

**Create session cookies**

```ts
//Create a new session cookie from the user idToken
const { token, user } = await auth.signInWithEmailAndPassword(
  'my@email.com',
  'supersecurepassword'
);

const sessionCookie = await auth.createSessionCookie(token.idToken);
```

**Verify session cookies**

```ts
auth
  .verifySessionCookie(sessionCookie)
  .then((token) => useToken(token))
  .catch((e) => console.log('Invalid session cookie'));
```

**Cache OAuth tokens with Cloudflare KV**

```ts
import { FlarebaseAuth, CloudflareKv } from 'flarebase-auth';

const auth = new FlarebaseAuth({
  apiKey: 'Firebase api key',
  projectId: 'Firebase project id',
  privateKey: 'Firebase private key or service account private key',
  serviceAccountEmail: 'Firebase service account email',
  cache: new CloudflareKv(NAMESPACE),
});
```

# Test environment

If you want to test this library, have a look at `/src/test.env.example.json`.
Create a new file in the same directory called `test.env.json` with the real values and
run the tests with `npm test`

```json
{
  "FIREBASE_TEST_CREDENTIALS": {
    "apiKey": "MY FIREBASE API KEY",
    "projectId": "FIREBASE PROJECT ID",
    "privateKey": "FIREBASE PRIVATE KEY OR SERVICE ACCOUNT PRIVATE KEY",
    "serviceAccountEmail": "FIREBASE SERVICE ACCOUNT EMAIL"
  },

  "FIREBASE_TEST_USER": {
    "email": "test@test.com",
    "password": "password123"
  }
}
```

# To-do

- [x] Add caching support (Cloudflare KV)
- [ ] sendEmailVerification()
- [ ] confirmEmailVerification()
- [ ] deleteAccount()

# License

```xml
Copyright (c) 2022 Marco

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
