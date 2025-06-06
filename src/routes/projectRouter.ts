import { projectController } from '../controllers';
import createBaseRouter from './base/BaseRouter';

export const projectRouter = createBaseRouter(projectController);