import { taskController } from '../controllers';
import createBaseRouter from './base/BaseRouter';

export const taskRouter = createBaseRouter(taskController);