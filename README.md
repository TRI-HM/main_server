# main structure 
.{src}
├── controllers                # All controller operations according the routes are stored here
│   ├── authController.ts      # Handles authentication requests
│   ├── usersController.ts     # Handles users route requests
│   └── ...
│
├── database                   # All database connections are stored here. For example you have two databases
│   ├── db.ts                  # Initialize DB connection
│   └── ...
│
├── middleware
│   ├── authenticated.ts       # Decode and verify JWT token
│   ├── error.ts               # Common Error Handler
│   ├── logger.ts              # Control logging levels
│   └── ...
│
├── models                     # Simple descriptor of the database tables
│   ├── usersModel.ts          # DB model for users
│   └── ...
│
├── schema                     # Schemas that are used for CRUD operations with the models
│   ├── users.ts               # DB Schema for users
│   └── ...
│
├── listeners
│   ├── socketsManager.ts      # Socket listeners/emitters handle
│   └── ...
│
├── app.ts                     # Entry file for the project
├── .env                       # Store environment variables
├── routes.ts                  # All routes initializer
└── ...