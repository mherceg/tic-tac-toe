declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'trace' | 'dev' | 'prod' | undefined;
        PORT: string | undefined;
      }
    }
  }
  
  export {}