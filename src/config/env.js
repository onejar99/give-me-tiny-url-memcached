const env = process.env.NODE_ENV || 'development';
console.log(`env=[${env}]`);

switch (env) {
    case 'development':
        process.env.PORT = 3000;
        process.env.MONGODB_URL = 'mongodb://localhost:27017/TinyUrlApp';
        process.env.MEMCACHED_HOST = 'localhost';
        process.env.MEMCACHED_PORT = 11211;
        break;
    case 'test':
        break;
}
