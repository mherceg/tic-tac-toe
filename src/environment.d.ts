declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'trace' | 'dev' | 'prod' | undefined;
      }
    }
  }
  
  export {}