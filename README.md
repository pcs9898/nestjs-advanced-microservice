# nestjs-advanced-microservices

crud, upload, download, api versioning

db postgres, redis, migration, seed, index

config service, custom decorator, custom filter, custom guard, custom interceptor, custom middleware

mailing(auth code, analytics), notification with sentry, slack

rate limit (throttle), health check, scheduling(batch, analytics)

unit test, e2e test

applying cqrs(command, query, event) for all module

applying microservices for all modules

separate APIs to which the cqrs pattern is applied into microservices

## Initial Settings

- [x] db entity, migration, index, seed
- [x] common
- [x] app.module.ts, main.ts settings
- [x] all microservices docker-compose, db's docker-compose, .env configuration

## Api-gateway(include auth logic) - tcp, kafka - redis

- [x] api1-signup/v1
- [x] api2-verifyAuthCode/v1
- [x] api3-resendAuthCode/v1
- [x] api4-signin/v1
- [x] api5-restoreAccessToken/v1
- [x] api6-signout/v1
- [x] cqrs (api2,3,4,5,6,7) with api v2

## Health MicroService - tcp

- [x] api7-check/v1
- [x] detach to microservice

## User MicroService - tcp - postgres(user-service)

- [x] api8-findAll/v1
- [x] api9-findOne/v1
- [x] cqrs (api8,9) with api v2
- [x] detach to microservice

## Schedule-batch MicroService - kafka

- [x] ScheduledBatchService-unVerifiedUserOver30DaysCleanUp
- [ ] detach to microservice

## Video MicroService - tcp - postgres(video-service)

- [x] api10-upload/v1
- [x] api11-findAll/v1
- [x] api12-findOne/v1
- [x] api13-download/v1
- [x] cqrs (api10,11,12,13) with api v2
- [ ] detach to microservice

## Analytics MicroService - kafka

- [x] AnalyticsService-findTop5DownloadVideos
- [ ] detach to microservice

## Mail MicroService - kafka

- [x] MailService-sendAuthCode
- [x] MailService-sendFindTop5downloadVideos
- [ ] detach to microservice
