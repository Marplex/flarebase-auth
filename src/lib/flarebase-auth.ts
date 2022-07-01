import { decodeProtectedHeader, importX509, jwtVerify } from 'jose';

import { getAuthToken, verifyIdToken } from './google-oauth';
import { DecodedIdToken } from './models/token';
import { User } from './models/user';

export type FlarebaseConfig = {
  readonly projectId: string;
  readonly apiKey: string;
  readonly serviceAccountEmail: string;
  readonly privateKey: string;
};

/**
 * Interact with Firebase REST Api and Google Identity Toolkit Api.
 * Made to work with Cloudflare Workers
 */
export class FlarebaseAuth {
  private BASE_URL = 'https://identitytoolkit.googleapis.com/v1/';

  constructor(public readonly config: FlarebaseConfig) {}

  /**
   * Send a post request to the identity toolkit api
   * @param formData POST form data
   * @param endpoint endpoint of the identity toolkit googleapis
   * @returns HTTP Response
   */
  private sendFirebaseAuthPostRequest(
    formData: Record<string, string>,
    endpoint: string
  ): Promise<Response> {
    const params = {
      method: 'post',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const URI =
      this.BASE_URL + `accounts:${endpoint}?key=${this.config.apiKey}`;

    return fetch(URI, params);
  }

  /**
   * Retrieve user info from a Firebase ID token
   * @param idToken A valid Firebase ID token
   * @returns User info linked to this ID token
   */
  private async lookupUser(idToken): Promise<User> {
    const response = await this.sendFirebaseAuthPostRequest(
      { idToken: idToken },
      'lookup'
    );

    if (response.status != 200) throw Error(await response.text());
    const data = (await response.json()) as any;
    return data.users[0] as User;
  }

  /**
   * Sign in Firebase user with email and password
   * @param email Email of the Firebase user
   * @param password Password of the Firebase user
   * @returns The decoded JWT token payload and the signed in user info
   */
  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<{ token: DecodedIdToken; user: User }> {
    const response = await this.sendFirebaseAuthPostRequest(
      {
        email: email,
        password: password,
        returnSecureToken: 'true',
      },
      'signInWithPassword'
    );

    if (response.status != 200) throw Error(await response.text());
    const token = (await response.json()) as DecodedIdToken;
    const user = await this.lookupUser(token.idToken);

    return { token, user };
  }

  /**
   * Sign up Firebase user with email and password
   * @param email Email of the Firebase user
   * @param password Password of the Firebase user
   * @returns The decoded JWT token payload and the signed in user info
   */
  async signUpWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<{ token: DecodedIdToken; user: User }> {
    const response = await this.sendFirebaseAuthPostRequest(
      {
        email: email,
        password: password,
        returnSecureToken: 'true',
      },
      'signUp'
    );

    if (response.status != 200) throw Error(await response.text());
    const token = (await response.json()) as DecodedIdToken;
    const user = await this.lookupUser(token.idToken);

    return { token, user };
  }

  /**
   * Creates a session cookie for the given Identity Platform ID token.
   * The session cookie is used by the client to preserve the user's login state.
   * @param idToken A valid Identity Platform ID token
   * @param expiresIn The number of seconds until the session cookie expires.
   * Specify a duration in seconds, between five minutes and fourteen days, inclusively.
   * @returns The session cookie that has been created
   */
  async createSessionCookie(
    idToken: string,
    expiresIn: number = 60 * 60 * 24 * 14 //14 days
  ): Promise<string> {
    //Create the OAuth 2.0 token
    //TODO: OAuth token should be cached until expiration
    const token = await getAuthToken(
      this.config.serviceAccountEmail,
      this.config.privateKey,
      'https://www.googleapis.com/auth/identitytoolkit'
    );

    //Post params and header authorization
    const params = {
      method: 'post',
      body: JSON.stringify({
        idToken: idToken,
        validDuration: expiresIn + '',
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    //POST request
    const path = `projects/${this.config.projectId}:createSessionCookie`;
    const response = await fetch(this.BASE_URL + path, params);
    if (response.status != 200) throw Error(await response.text());

    //Get session cookie
    const sessionCookieResponse = await response.json();
    return sessionCookieResponse.sessionCookie as string;
  }

  /**
   * Verify if the provided session cookie is valid.
   * @param sessionCookie JWT session cookie generated from createSessionCookie
   * @returns The decoded JWT payload
   */
  async verifySessionCookie(sessionCookie: string): Promise<DecodedIdToken> {
    //Fetch google public key
    const res = await fetch(
      'https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys'
    );

    const header = decodeProtectedHeader(sessionCookie);
    const data = await res.json();
    if (!data[header.kid]) throw Error('Cannot find public key');

    //Get certificate from JWT key id
    const certificate = data[header.kid];
    const publicKey = await importX509(certificate, 'RS256');

    //Verify the sessionCookie with the publicKey
    const { payload } = await jwtVerify(sessionCookie, publicKey, {
      issuer: `https://session.firebase.google.com/${this.config.projectId}`,
      audience: this.config.projectId,
    });

    return payload as any as DecodedIdToken;
  }

  /**
   * Verifies a Firebase ID token (JWT).
   * If the token is valid, the promise is fulfilled with the token's decoded claims; otherwise, the promise is rejected.
   * @param idToken An Identity Platform ID token
   */
  async verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    return (await verifyIdToken(idToken)) as any as DecodedIdToken;
  }
}
