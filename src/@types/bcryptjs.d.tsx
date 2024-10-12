declare module 'bcryptjs' {
    function hash(data: string, salt: string | number): Promise<string>;
    function compare(data: string, encrypted: string): Promise<boolean>;
    // Add more function declarations as needed
    export { hash, compare };
  }
  