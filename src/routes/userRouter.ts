import { userController } from '../controllers';
import createBaseRouter from './base/BaseRouter';

export const userRouter = createBaseRouter(userController);