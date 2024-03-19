import { userController } from './user.bootstrap';
import { Router } from '@tscc/core';

const router = new Router();

// router.get('/', userController.getAll);
// router.get('/:id', userController.get);
// router.post(userController.create.path, userController.create.handler);
// router.put('/:id', userController.update);
// router.delete('/:id', userController.delete);


export default new Router().registerClassRoutes(userController).instance;
