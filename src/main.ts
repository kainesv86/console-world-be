import * as dotenv from 'dotenv';
dotenv.config({
    path: `config/.env.${process.env.NODE_ENV}`,
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { monoLogger } from 'mono-utils-core';
import { config, constant, router } from './core';
import { CustomLoggerService } from './core/providers';
import { ConfigService } from '@nestjs/config';
import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: new CustomLoggerService() });
    const configService: ConfigService = app.get(ConfigService);
    const adminConfig: ServiceAccount = {
        projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
        privateKey: configService.get<string>('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
    };

    admin.initializeApp({ credential: admin.credential.cert(adminConfig), storageBucket: 'gs://racvjppro.appspot.com' });

    router(app);

    await app.listen(config.PORT, () => {
        monoLogger.log(constant.NS.APP_INFO, `Current Mode: ${config.NODE_ENV}`);
        monoLogger.log(constant.NS.APP_INFO, `Listening on port ${config.PORT}`);
        monoLogger.log(constant.NS.APP_INFO, `Ready to service`);
    });
}

monoLogger.log(constant.NS.APP_INFO, `---------------Configuration--------------------`);
monoLogger.log(constant.NS.APP_INFO, config);
monoLogger.log(constant.NS.APP_INFO, `-----------------------------------`);

bootstrap();
