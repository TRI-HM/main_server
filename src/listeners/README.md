project-root/
│── src/
│ ├── config/ # Cấu hình app (env, logger, database, socket options)
│ ├── server.ts # Khởi tạo Express + HTTP server + Socket.IO
│ ├── app.ts # Express config (middleware, routes REST nếu có)
│ │
│ ├── sockets/ # Logic socket.io
│ │ ├── index.ts # Khởi tạo socket.io, load tất cả namespace/rooms
│ │ ├── chat.socket.ts # Module cho chat
│ │ ├── game.socket.ts # Module cho game
│ │ └── ...  
│ │
│ ├── modules/ # Business logic (theo domain)
│ │ ├── chat/
│ │ │ ├── chat.controller.ts
│ │ │ ├── chat.service.ts
│ │ │ ├── chat.model.ts
│ │ │ └── chat.types.ts
│ │ └── user/
│ │ ├── user.controller.ts
│ │ ├── user.service.ts
│ │ ├── user.model.ts
│ │ └── user.types.ts
│ │
│ ├── utils/ # Helper chung (jwt, validate, format message...)
│ └── types/ # Kiểu global TypeScript (interface, enum)
│
├── .env # Biến môi trường
├── tsconfig.json
├── package.json
└── README.md
