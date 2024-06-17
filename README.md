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

## Health Module

- [x] api1-check/v1
- [x] testCode

## Auth Module

- [x] api2-signup/v1
- [x] api3-verifyAuthCode/v1
- [x] api4-resendAuthCode/v1
- [x] api5-signin/v1
- [x] api6-restoreAccessToken/v1
- [x] api7-signout/v1
- [x] cqrs (api2,3,4,5,6,7) with api v2
- [x] testCode

## Mail Module

- [x] MailService-sendAuthCode
- [x] MailService-sendFindTop5downloadVideos
- [x] testCode

## User Module

- [x] api8-findAll/v1
- [x] api9-findOne/v1
- [x] cqrs (api8,9) with api v2
- [x] testCode

## Schedule-batch Module

- [x] ScheduledBatchService-unVerifiedUserOver30DaysCleanUp
- [x] testCode

## Video Module

- [x] api10-upload/v1
- [x] api11-findAll/v1
- [x] api12-findOne/v1
- [x] api13-download/v1
- [x] cqrs (api10,11,12,13) with api v2
- [x] testCode

## Analytics Module

- [x] AnalyticsService-findTop5DownloadVideos
- [x] testCode
