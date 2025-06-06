import { organisationController } from '../controllers';
import createBaseRouter from './base/BaseRouter';

export const organisationRouter = createBaseRouter(organisationController);