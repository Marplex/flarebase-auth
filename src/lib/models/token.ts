import { JWTPayload } from 'jose';

export interface DecodedIdToken extends JWTPayload {
  readonly idToken: string;
  readonly email: string;
  readonly refreshToken: string;
  readonly expiresIn: string;
  readonly localId: string;
  readonly registered: boolean;
}
