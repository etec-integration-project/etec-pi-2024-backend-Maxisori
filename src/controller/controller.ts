import { Response, Request } from 'express';
import { AppDataSource } from '../persistence/db';
import { Product } from '../persistence/product';
import { User } from '../persistence/user';
import { Cart } from '../persistence/cart';
import bcrypt from 'bcrypt';

// Obtener todos los productos
export const getProducts = async (_: Request, res: Response) => {
    try {
        const products = AppDataSource.manager.getRepository(Product);
        const final = await products.find();
        res.json(final);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Agregar productos al carrito
export const addProductsToDB = async (req: Request, res: Response) => {
    const { jsonifiedCart } = req.body;

    if (!jsonifiedCart) {
        return res.status(400).json({ error: 'Faltan datos en el carrito' });
    }

    try {
        const cartEntity = new Cart(jsonifiedCart);
        await AppDataSource.manager.save(Cart, cartEntity);
        return res.status(201).json({ message: 'Carrito registrado exitosamente' });
    } catch (error) {
        console.error('Error al agregar productos al carrito:', error);
        return res.status(500).json({ error: 'Error al guardar el carrito' });
    }
};

// Registrar un nuevo usuario
export const addUserToDB = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Validar campos obligatorios
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Faltan datos del usuario' });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await AppDataSource.manager.findOne(User, {
            where: [{ username }, { email }],
        });

        if (existingUser) {
            return res.status(400).json({
                error: existingUser.username === username
                    ? 'El nombre de usuario ya está en uso'
                    : 'El correo electrónico ya está en uso',
            });
        }

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear y guardar el nuevo usuario
        const newUser = new User(username, email, hashedPassword);
        await AppDataSource.manager.save(newUser);

        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        return res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
};

// Iniciar sesión
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Validar campos obligatorios
    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos para iniciar sesión' });
    }

    try {
        let user;

        // Verificar si el valor ingresado es un email o un nombre de usuario
        if (username.includes('@')) { // Si es un email
            user = await AppDataSource.manager.findOne(User, {
                where: { email: username },
            });
        } else { // Si es un nombre de usuario
            user = await AppDataSource.manager.findOne(User, {
                where: { username },
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: 'Nombre de usuario o correo electrónico incorrectos',
            });
        }

        // Comparar la contraseña ingresada con la almacenada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                msg: 'Nombre de usuario o contraseña incorrectos',
            });
        }

        // Si las credenciales son correctas
        return res.json({
            success: true,
            msg: 'Iniciaste sesión exitosamente',
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};
