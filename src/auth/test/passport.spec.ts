import { INestApplication } from '@nestjs/common';
import { Profile as GoogleProfile } from 'passport-google-oauth20';

//---- Helper

//---- Passport Strategy
import { GoogleStrategy } from '../passport/google.strategy';

//---- Repository

//---- Service
import { UserRepository } from '../../core/repositories';
import { fakeData } from '../../core/test/helper';
import { initTestModule } from '../../core/test/initTest';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

describe('FacebookStrategy', () => {
    let app: INestApplication;
    let userRepository: UserRepository;

    let userService: UserService;
    let authService: AuthService;

    let googleStrategy: GoogleStrategy;
    let resetDb: any;
    beforeAll(async () => {
        const { getApp, module, resetDatabase } = await initTestModule();
        app = getApp;
        resetDb = resetDatabase;

        userRepository = module.get<UserRepository>(UserRepository);
        userService = module.get<UserService>(UserService);
        authService = module.get<AuthService>(AuthService);

        googleStrategy = new GoogleStrategy(userService, authService);
    });

    describe('GoogleStrategy', () => {
        let profile: GoogleProfile;

        beforeEach(() => {
            profile = {
                displayName: 'test',
                id: fakeData(10),
                photos: [
                    {
                        value: 'dsa',
                    },
                ],
                _raw: '',
                profileUrl: '',
                _json: {
                    iss: 'https://accounts.google.com',
                    azp: '1234987819200.apps.googleusercontent.com',
                    aud: '1234987819200.apps.googleusercontent.com',
                    sub: '10769150350006150715113082367',
                    at_hash: 'HK6E_P6Dh8Y93mRNtsDB1Q',
                    hd: 'example.com',
                    email: 'jsmith@example.com',
                    email_verified: 'true',
                    iat: 1353601026,
                    exp: 1353604926,
                    nonce: '0394852-3190485-2490358',
                },
                provider: 'github',
            };
        });

        it('Pass', async () => {
            await googleStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());

            const user = await userRepository.findOneByField('googleId', profile.id);
            expect(user.googleId).toBeDefined();
            expect(user.googleId).toBe(profile.id);
        });

        it('Pass (user validate 2 times but only exist one in database)', async () => {
            await googleStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());
            await googleStrategy.validate('', '', profile, (_, data) => expect(data).toBeDefined());

            const user = await userRepository.findManyByField('googleId', profile.id);
            expect(user.length).toBe(1);
            expect(user[0].googleId).toBe(profile.id);
        });

        it('Failed (missing some properties in profile)', async () => {
            delete profile._json;
            delete profile.displayName;
            delete profile.photos;

            await googleStrategy.validate('', '', profile, (error, data) => {
                expect(data).toBeNull();
                expect(error).toBeDefined();
            });

            const user = await userRepository.findOneByField('googleId', profile.id);
            expect(user).toBeUndefined();
        });
    });

    afterAll(async () => {
        await resetDb();
        await app.close();
    });
});
