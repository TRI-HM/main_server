import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const DBConfig = {
  HOST: process.env.DB_HOST || "localhost",
  DATABASE: process.env.DB_NAME || "server",
  USERNAME: process.env.DB_USERNAME || "root",
  PASSWORD: process.env.DB_PASSWORD || "root",
  PORT: parseInt(process.env.DB_PORT!) || 3306,
  DIALECT: process.env.DB_DIALECT || "mysql",
};

export default DBConfig;
