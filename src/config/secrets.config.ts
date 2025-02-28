import { registerAs } from '@nestjs/config';

export default registerAs('secrets', () => {
  return {
    databaseUsername: process.env.POSTGRESQL_DATABASE_USERNAME,
    databaseName: process.env.POSTGRESQL_DATABASE_NAME,
    databasePort: process.env.POSTGRESQL_DATABASE_PORT,
    databaseHost: process.env.POSTGRESQL_DATABASE_HOST,
    databasePassword: process.env.POSTGRESQL_DATABASE_PASSWORD,
    hashToken: process.env.SECRET_HASH,
  };
});
