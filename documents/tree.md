```
main_server/
├── deploy.sh
├── docker-compose.yml
├── Dockerfile
├── mysql-config.cnf
├── package-lock.json
├── package.json
├── README.md
├── scripts/
│   └── runTests.ts
├── setup-vps.sh
├── src/
│   ├── app.ts
│   ├── database/
│   │   ├── config.ts
│   │   ├── db.ts
│   │   └── sequelizeCLI/
│   │       ├── config/
│   │       │   └── database.js
│   │       ├── migrations/
│   │       │   ├── 20250417051049-create-users-model.js
│   │       │   ├── 20250623060305-create-vitamin.js
│   │       │   ├── 20250924072942-create-staff.js
│   │       │   ├── 20250924073901-create-apartment.js
│   │       │   ├── 20250929065625-create-views.js
│   │       │   ├── 20250930035400-create-button-log.js
│   │       │   └── 20251211085947-create-video.js
│   │       └── seeders/
│   ├── domain/
│   │   ├── ai/
│   │   │   ├── elevenlabs/
│   │   │   │   └── textToMusic/
│   │   │   │       ├── controller.ts
│   │   │   │       └── route.ts
│   │   │   └── route.ts
│   │   ├── game/
│   │   │   └── vitamin/
│   │   │       ├── controller.ts
│   │   │       └── route.ts
│   │   ├── image/
│   │   │   ├── controller.ts
│   │   │   ├── readme.md
│   │   │   └── route.ts
│   │   ├── login/
│   │   │   ├── controller.ts
│   │   │   └── route.ts
│   │   ├── routes.ts
│   │   ├── user/
│   │   │   ├── controller.ts
│   │   │   └── route.ts
│   │   └── video/
│   │       ├── controller.ts
│   │       └── route.ts
│   ├── listeners/
│   │   ├── modules/
│   │   │   ├── buttonLog/
│   │   │   │   └── buttonLog.service.ts
│   │   │   └── realEstate/
│   │   │       ├── realEstate.apartment.service.ts
│   │   │       └── realEstate.view.service.ts
│   │   ├── sockets/
│   │   │   ├── buttonLog/
│   │   │   │   ├── buttonLog.controller.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── readme.md
│   │   │   ├── fightingGame/
│   │   │   │   ├── docs/
│   │   │   │   │   ├── design.jpg
│   │   │   │   │   └── readme.md
│   │   │   │   ├── event.controller.ts
│   │   │   │   ├── fightingGame.controller.ts
│   │   │   │   └── types.ts
│   │   │   ├── realEstate/
│   │   │   │   ├── index.ts
│   │   │   │   ├── readme.md
│   │   │   │   └── realEstate.controller.ts
│   │   │   ├── show-big-screen/
│   │   │   │   └── controller.ts
│   │   │   └── user/
│   │   │       └── controller.ts
│   │   └── socketsManager.ts
│   ├── middleware/
│   │   ├── authenticated.ts
│   │   ├── error.ts
│   │   ├── logger.ts
│   │   └── validateVideoFile.ts
│   ├── models/
│   │   ├── buttonLog/
│   │   │   └── buttonLog.model.ts
│   │   ├── game/
│   │   │   └── vitamin.ts
│   │   ├── index.js
│   │   ├── README.md
│   │   ├── realEstate.apartment.ts
│   │   ├── realEstate.staff.ts
│   │   ├── realEstate.views.ts
│   │   ├── userModel.ts
│   │   ├── usersModelExample.ts
│   │   └── video.model.ts
│   ├── schema/
│   │   └── users.ts
│   ├── services/
│   │   ├── ai/
│   │   │   └── elevenlabs/
│   │   │       └── textToMusic.service.ts
│   │   ├── game/
│   │   │   └── vitamin/
│   │   │       └── vitaminService.ts
│   │   ├── userService.ts
│   │   └── video.service.ts
│   ├── types/
│   │   └── paginationInfo.io.ts
│   ├── useCases/
│   │   ├── buttonLog/
│   │   │   └── buttonLog.useCase.ts
│   │   ├── fightingGame/
│   │   │   └── fightingGame.useCase.ts
│   │   ├── readme.md
│   │   ├── realEstate/
│   │   │   ├── realEstate.useCases.ts
│   │   │   └── realEstate.view.useCases.ts
│   │   └── video/
│   │       └── video.useCase.ts
│   └── util/
│       ├── checker.ts
│       ├── generateNameWithTime.ts
│       ├── ioCustom.ts
│       ├── multher.ts
│       ├── pagination.util.ts
│       ├── README.md
│       ├── realEstate.validationSchema.ts
│       ├── videoMulther.ts
│       ├── wrapAsync.ts
│       └── wrapAsyncSocket.ts
├── tree.md
└── tsconfig.json
```
