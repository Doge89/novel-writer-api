export interface CryptoServiceBase {
  generateSaltValue(rounds?: number, minor?: 'a' | 'b'): Promise<string>;
  encryptString(input: string, isPassword: boolean): Promise<string>;
  isTextSameAsEncrypted(plainText: string, encrypted: string): Promise<boolean>;
  createRandomHash(size: number): string;
  hashString(input: string): string;
  revealHashString(hashedString: string): string;
}
