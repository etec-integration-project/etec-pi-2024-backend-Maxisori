import { Response, Request } from 'express'
import { AppDataSource } from '../persistence/db';
import { Product } from '../persistence/product';
import { User } from '../persistence/user';
import { Cart } from '../persistence/cart';

export const getProducts = async (_: Request, res: Response) => {
    const products = AppDataSource.manager.getRepository(Product);
    const final = await products.find()
    res.json(final);
}

export const addProductsToDB = async (req: Request, res: Response) => {
    const { jsonifiedCart } = req.body;

    const cartEntity = new Cart(jsonifiedCart);

    await AppDataSource.manager.save(Cart, cartEntity);

    return res.status(201).json({ message: 'Carrito registrado exitosamente' });
}

export const addUserToDB = async (req: Request, res: Response) => {    
    // Variables que se traen desde el FrontEnd (con axios)
    const { username, email, password } = req.body;

    try {
        // se fija si ya existe el usuario en la base (si esta con ese nombre o email)
        const existingUser = await AppDataSource.manager.findOne(User, { where: { username, email } });

        if (existingUser) {
            // si ya esta etonces tira error
            return res.status(400).json({ error: 'El Usuario o Email ya esta en uso' });
        } else {
            // si no esta lo crea usando el modelo (user.ts)
            const newUser = new User(username, email, password);

            try {
                //lo guarda en la base
                await AppDataSource.manager.save(newUser);

                return res.status(201).json({ message: 'Usuario registrado exitosamente' });
            } catch (error) {
                // si pasa algo da error
                console.error('Error al registrar el usuario:', error);
                return res.status(500).json({ error: 'Error al conectar con la base de datos' });
            }
        }

    } catch (err) {
        console.error('Error al registrar el usuario:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }  
}

export const loginUser = async (req: Request, res: Response) => {
    // Se trae las variables desde el Front (con axios)
    const { username, password } = req.body
    // se fija si ya existe el usuario en la base (con el nombre y contraseña)
    const user = await AppDataSource.manager.findOne(User, { where: { username, password } });
    if (user) {
        // si ya exista tira exito
        res.json({
            success: true,
            msg: "Iniciaste sesion exitosamente"
        });       
    } else {
        // si no error
        res.status(401).json({
            success: false,
            msg: "Erroro al iniciar sesion"
        })
    }
}