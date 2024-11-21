import { DataSource } from "typeorm";
import { Product } from "./product";
import { User } from "./user";
import { Cart } from "./cart";
import "reflect-metadata";
import "dotenv/config";

// Configuración de la conexión a la base de datos con la opción para crear la base si no existe
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST, // Definido en el .env
    port: 3306,
    username: process.env.DB_USER, // Definido en el .env
    password: process.env.DB_PASSWORD, // Definido en el .env
    database: process.env.DB_NAME, // Definido en el .env
    synchronize: true, // Crea las tablas automáticamente
    logging: true, // Para depurar
    entities: [Product, User, Cart], // Tus entidades
    subscribers: [],
    migrations: [],
    extra: {
        createDatabaseIfNotExist: true, // Crea la base de datos automáticamente si no existe
    },
});

// Inicializar la conexión a la base de datos
AppDataSource.initialize()
    .then(() => {
        console.log("Conexión exitosa a la base de datos. Tablas creadas automáticamente.");
    })
    .catch((error) => {
        console.error("Error al conectar con la base de datos:", error);
    });
