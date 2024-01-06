import Joi from 'joi';

const validateEnv = () => {
    const schema = Joi.object()
        .keys({
            NODE_ENV: Joi.string().valid('development', 'production').required(),
            DISCORD_TOKEN: Joi.string().required(),
            SUPABASE_ANON_KEY: Joi.string().required(),
            SUPABASE_URL: Joi.string().required(),
            LOGIN_WEBHOOK_ID: Joi.string().required(),
            LOGIN_WEBHOOK_TOKEN: Joi.string().required()
        })
        .unknown();

    const { error } = schema.prefs({ errors: { label: 'key' } }).validate(process.env);

    if (error) throw new Error(error.message);
};

export default validateEnv;
