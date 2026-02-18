export const envConfig = {
    PORT: process.env.PORT || 5000,
    MONGODB_URL: process.env.MONGODB_URL || '',
    ENCRYPTED: process.env.ENCRYPTED === 'true',
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'default_secret_key',
};
