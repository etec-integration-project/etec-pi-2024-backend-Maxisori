import { DataSource } from "typeorm";
import { Product } from "./product";
import { User } from "./user";
import { Cart } from "./cart";
import "reflect-metadata";
import "dotenv/config";

// Configuración de la conexión a la base de datos con las variables de entorno correctas
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST, // Definido en el .env
    port: 3306,
    username: process.env.DB_USER, // Definido en el .env
    password: process.env.DB_PASSWORD, // Definido en el .env
    database: process.env.DB_NAME, // Definido en el .env
    synchronize: true,
    logging: true,
    entities: [Product, User, Cart], // Define tus entidades aquí
    subscribers: [],
    migrations: [],
});

// Verificación de la conexión a la base de datos
AppDataSource.initialize()
    .then(() => {
        console.log("Conexión exitosa a la base de datos");
    })
    .catch((error) => {
        console.error("Error al conectar con la base de datos:", error);
    });

// Tipos de datos personalizados
export type Producto = {
    id: number;
    img: string;
    name: string;
    price: number;
    quantity: number;
};

export type Usuario = {
    id: number;
    username: string;
    email: string;
    password: string;
    password2: string;
};

// Datos mockeados (puedes eliminarlos si no los necesitas)

export const udb: Array<Usuario> = [
    {
        id: 1,
        username: "Maci",
        email: "Maci@gmail.com",
        password: "maci123",
        password2: "maci123",
    },
];
