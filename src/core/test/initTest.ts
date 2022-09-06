import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { UserRepository } from '../repositories';
import { router } from '../router';
import { fakeUser } from './helper';

const resetDatabase = async (module: TestingModule) => {
    //     const userRepository = module.get<UserRepository>(UserRepository);
    //     await userRepository.createQueryBuilder().delete().execute();
    //     await userRepository.clear();
};

export const initTestModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const configModule = module.createNestApplication();
    //apply middleware
    router(configModule);
    const getApp = await configModule.init();

    //create a fake user and token
    const userRepository = module.get<UserRepository>(UserRepository);

    return {
        resetDatabase: async () => await resetDatabase(module),
        getFakeUser: async () => await userRepository.save(fakeUser()),
        getApp,
        module,
        configModule,
    };
};
