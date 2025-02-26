import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
  awsBucket: process.env.AWS_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  awsCloudfrontUrl: process.env.AWS_CLOUDFRONT,
  awsAccessKey: process.env.AWS_ACCESS_KEY,
  awsSecretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  smtpMailHost: process.env.SMTP_MAIL_HOST,
  smtpMailPassword: process.env.SMTP_MAIL_PASSWORD,
  smtpMailUsername: process.env.SMTP_MAIL_USERNAME,
}));
