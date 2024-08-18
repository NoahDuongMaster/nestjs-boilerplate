import Joi from 'joi';

export default () => ({
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 8080,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  SWAGGER_ENABLE: process.env.SWAGGER_ENABLE,
  STAGE: process.env.STAGE || 'dev',
});

const envValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3000),
  MONGODB_URI: Joi.string().uri(),
  ALLOWED_ORIGINS: Joi.string().required(),
  SWAGGER_ENABLE: Joi.boolean().required(),
  STAGE: Joi.string()
    .required()
    .default('dev')
    .valid(
      'dev',
      'staging',
      'prod',
      'beta',
      'alpha',
      'uat',
      'it',
      'test',
      'local',
    ),
});

export { envValidationSchema };
