import { LocalStorage } from "node-localstorage";
import fs, { existsSync } from "fs";
import os from "os";

const localStorage = new LocalStorage("./localStorage");

export default localStorage;