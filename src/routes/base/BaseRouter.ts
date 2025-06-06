import { Router } from 'express';

const createBaseRouter = (controller: any) => {
  const router = Router();

  router.get('/', controller.getAll);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);
  router.get('/field/:field/:value', controller.getByField);
  router.get('/fields/many', controller.getByFields);
  router.post('/many', controller.createMany);
  
  return router;
};

export default createBaseRouter;
