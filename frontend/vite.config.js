"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;

const { DataSource } = require("typeorm");
const { entities } = require("./src/entities");
const dotenv = require("dotenv");

dotenv.config(); // charge les variables d'environnement

exports.AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,          // <- Render fournit cette URL
    ssl: { rejectUnauthorized: false },     // <- obligatoire pour Render
    entities: entities,                     // tes entités TypeORM
    migrations: ["src/migrations/*.ts"],   // tes migrations
    synchronize: false,                     // true seulement en dev
    logging: true,
});
