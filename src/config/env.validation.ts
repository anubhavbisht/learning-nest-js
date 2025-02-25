import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  PROFILE_API_KEY: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_TOKEN_AUDIENCE: Joi.string().required(),
  JWT_TOKEN_ISSUER: Joi.string().required(),
  JWT_ACCESS_TOKEN_TTL: Joi.number().default(3600),
  JWT_REFRESH_TOKEN_TTL: Joi.number().default(86400),
  GOOGLE_AUTH_CLIENT_ID: Joi.string().required(),
  GOOGLE_AUTH_CLIENT_SECRET: Joi.string().required(),
  API_VERSION: Joi.string().required(),
  AWS_BUCKET_NAME: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_CLOUDFRONT: Joi.string().required(),
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_ACCESS_KEY_SECRET: Joi.string().required(),
  SMTP_MAIL_HOST: Joi.string().required(),
  SMTP_MAIL_USERNAME: Joi.string().required(),
  SMTP_MAIL_PASSWORD: Joi.string().required(),
});
