import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  afterEach(() => app.close());
  //it('/ (GET)', () => {
  // return request(app.getHttpServer())
  //  .get('/')
  // .expect(200)
  //.expect('Hello World!');
  //});
  describe('Auth', () => {
    const email = `${Math.random()}@example.com`;
    const password = Math.random().toString();
    let token;
    describe('POST /auth/register', () => {
      it('should validate the request', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .set('Accept', 'application/json')
          .send({
            email: 'hello@example.com',
            dateOfBirth: '2019-01-01',
          })
          .expect(400)
          .expect((res) => {
            expect(res.body.message).toContain('password should not be empty');
            expect(
              res.body.message.find((m: string) =>
                m.startsWith('maximal allowed date for dateOfBirth'),
              ),
            ).toBeDefined();
          });
      });

      it('should return HTTP 200 on successful registration', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .set('Accept', 'application/json')
          .send({
            email,
            password,
            dateOfBirth: '2000-01-01,',
            firstName: 'john',
            lastName: 'doe',
          })
          .expect(201)
          .expect((res) => {
            expect(res.body.access_token).toBeDefined();
          });
      });
    });
    describe('POST /auth/login', () => {
      it('should return 401 if username does not exists', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email: 'unkdown', password: 'anything' })
          .expect(401);
      });
      it('should return 401 if password is incorrect', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email, password: 'anything' })
          .expect(401);
      });
      it('should return 201 if username and password are correct', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({ email, password })
          .expect(201)
          .expect((res) => {
            expect(res.body.access_token).toBeDefined();
            token = res.body.access_token;
          });
      });
    });
    describe('GET /auth/user', () => {
      it('should authenticate a user with the jwt token', () => {
        return request(app.getHttpServer())
          .get('/auth/user')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.email).toBe(email);
          });
      });
    });
  });
});
