import express from 'express';
import cors from 'cors';
import { AppDataSource } from './persistence/db';
import { Product } from './persistence/product';
import { mainRouter } from './router/router';

// Inicializamos la aplicación de Express
const app = express();
const port = 8080; // Puerto donde correrá el servidor

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON

// Rutas principales
app.use('/', mainRouter); // Usar el router principal

// Función para agregar productos predeterminados si no existen
const addDefaultProducts = async () => {
    const validation_product = AppDataSource.manager.getRepository(Product);
    const product_exist = await validation_product.find();

    if (product_exist.length === 0) {
        console.log('No hay productos en la base de datos, agregando productos predeterminados...');

        const products = [
            new Product(
                'https://imgs.search.brave.com/AUibPgk1Z25t3UbUVU16XIMVyeyjZFfVYgmDhKU-L3I/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91bmRl/cndhdmVicmFuZC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDUvRFNDMDc4/OTQtMS5qcGc',
                'Remera negra Oversize',
                15000,
                5
            ),
            new Product(
                'https://imgs.search.brave.com/Mei0Rs5phPofNkohB7JNLD8vyxOB-Jj_a1erHE9qHog/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9OUV9OUF84/NTY4NzctTUxBNTIx/MjUxMDc2NjBfMTAy/MDIyLVcud2VicA',
                'Remera Simple',
                15000,
                1
            ),
            new Product(
                'https://imgs.search.brave.com/AUibPgk1Z25t3UbUVU16XIMVyeyjZFfVYgmDhKU-L3I/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91bmRl/cndhdmVicmFuZC5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjMvMDUvRFNDMDc4/OTQtMS5qcGc',
                'Sueter',
                25000,
                6
            ),
        ];

        try {
            for (const product of products) {
                const existingProduct = await validation_product.findOne({
                    where: { name: product.name },
                });

                if (!existingProduct) {
                    await AppDataSource.manager.save(product);
                    console.log(`Producto guardado: ${product.name}`);
                } else {
                    console.log(`Producto ya existe: ${product.name}`);
                }
            }
            console.log('Validación de productos completada.');
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    } else {
        console.log('Los productos ya existen en la base de datos.');
    }
};

// Inicializar la base de datos y el servidor
AppDataSource.initialize()
    .then(async () => {
        console.log('Base de datos conectada');

        // Agregar productos predeterminados si no existen
        await addDefaultProducts();

        // Iniciar el servidor
        app.listen(port, () => {
            console.log(`Servidor corriendo en http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error al inicializar la base de datos:', err);
    });
