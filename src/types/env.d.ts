namespace NodeJS {
  interface ProcessEnv {
    PORT: number;
    NODE_ENV:string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    DB_HOST: string;
    ACCESS_TOKEN_SECRET: string;
    SMS_ENDPOINT_VERIFY: string;
    SMS_API_KEY: string;
    SMS_TEMPLATEID: string;
    EMAIL_SERVICEID: string;
    EMAIL_TEMPLATEID: string;
    EMAIL_PUBLICKEY: string;
    EMAIL_PRIVATEKEY: string;
  }
}
