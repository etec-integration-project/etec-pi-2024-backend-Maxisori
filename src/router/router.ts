import express from 'express';
import { addProductsToDB, addUserToDB, getProducts, loginUser } from '../controller/controller';
const mainRouter = express.Router();

mainRouter.get('/', (_, res) => {
    res.send('Hola');
});

mainRouter.get('/producto', getProducts);
mainRouter.post('/anadir', addProductsToDB);
mainRouter.post('/registro', addUserToDB);
mainRouter.post('/login', loginUser)
mainRouter.post('/registro', addUserToDB);

export { mainRouter };  