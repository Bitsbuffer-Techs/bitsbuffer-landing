// Local ambient types for bcryptjs (the package ships no bundled .d.ts and
// @types/bcryptjs pulled a corrupted/empty install in one sandbox
// environment during development -- this local declaration removes the
// dependency on that package entirely, covering only the functions this
// project actually calls, in src/lib/auth/password.ts and
// scripts/hash-password.ts).
declare module 'bcryptjs' {
  export function genSaltSync(rounds?: number): string;
  export function genSalt(rounds?: number): Promise<string>;
  export function hashSync(data: string, salt?: string | number): string;
  export function hash(data: string, salt: string | number): Promise<string>;
  export function compareSync(data: string, encrypted: string): boolean;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function getRounds(encrypted: string): number;

  const bcrypt: {
    genSaltSync: typeof genSaltSync;
    genSalt: typeof genSalt;
    hashSync: typeof hashSync;
    hash: typeof hash;
    compareSync: typeof compareSync;
    compare: typeof compare;
    getRounds: typeof getRounds;
  };
  export default bcrypt;
}
