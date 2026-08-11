import { SignJWT, jwtVerify, importPKCS8, importSPKI } from 'jose';

// ES256 Public Key (Safe to expose to client)
const PUBLIC_KEY_PEM = process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY || `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEt4itQdIBv3r2KzlZIp6gWaWqaVN
gm6BoxgSb7tUtn9sG6fuy8rCR31vNqz/cIzRWdc6+JXf9pzAtrI7Y4e2xg==
-----END PUBLIC KEY-----`;

// ES256 Private Key (SERVER ONLY)
const getPrivateKeyStr = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Private key cannot be accessed on the client');
  }
  return process.env.JWT_PRIVATE_KEY || `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgjLm9AEaSH4F159zr
lwYH1OZa7Tzygf3tKbWGqgmwQyKhRANCAAQS3iK1B0gG/evYrOVkinqBZpappU2C
boGjGBJvu1S2f2wbp+7LysJHfW82rP9wjNFZ1zr4ld/2nMC2sjtjh7bG
-----END PRIVATE KEY-----`;
};

export interface TokenPayload {
  license_key: string;
  plan: string;
  features: string[];
  expires_at: string;
  hardware_id?: string;
  status: string;
}

export async function signLicenseToken(payload: TokenPayload): Promise<string> {
  const privateKeyPEM = getPrivateKeyStr();
  const privateKey = await importPKCS8(privateKeyPEM, 'ES256');

  const token = await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setExpirationTime('14d') // Default token lifetime is 14 days for offline resilience
    .sign(privateKey);

  return token;
}

export async function verifyLicenseToken(token: string): Promise<TokenPayload | null> {
  try {
    const publicKey = await importSPKI(PUBLIC_KEY_PEM, 'ES256');
    const { payload } = await jwtVerify(token, publicKey);
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error('Invalid or expired token', error);
    return null;
  }
}
