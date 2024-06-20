# nestjs-advanced-microservices

crud, upload, download, api versioning

db postgres, redis, migration, seed, index

config service, custom decorator, custom filter, custom guard, custom interceptor, custom middleware

mailing(auth code, analytics), notification with sentry, slack

rate limit (throttle), health check, scheduling(batch, analytics)

unit test, e2e test

applying cqrs(command, query, event) for all module

applying microservices for all modules

## Initial Settings

- [x] db entity, migration, index, seed
- [x] common
- [x] app.module.ts, main.ts settings
- [x] all microservices docker-compose, db's docker-compose, .env configuration

## Api-gateway(include auth logic) - tcp, kafka

- [x] api2-signup/v1
- [x] api3-verifyAuthCode/v1
- [x] api4-resendAuthCode/v1
- [x] api5-signin/v1
- [x] api6-restoreAccessToken/v1
- [x] api7-signout/v1
- [x] cqrs (api2,3,4,5,6,7) with api v2

## Health MicroService - tcp

- [x] api1-check/v1

## Mail MicroService - tcp

- [x] MailService-sendAuthCode
- [x] MailService-sendFindTop5downloadVideos

## User MicroService - tcp

- [x] api8-findAll/v1
- [x] api9-findOne/v1
- [x] cqrs (api8,9) with api v2

## Schedule-batch MicroService - tcp, kafka

- [x] ScheduledBatchService-unVerifiedUserOver30DaysCleanUp

## Video MicroService - tcp

- [x] api10-upload/v1
- [x] api11-findAll/v1
- [x] api12-findOne/v1
- [x] api13-download/v1
- [x] cqrs (api10,11,12,13) with api v2

## Analytics MicroService - kafka

- [x] AnalyticsService-findTop5DownloadVideos
