import App from '@/app';
import { ChecklistController } from '@controllers/checklist.controller';
import { EmployeeController } from '@controllers/employee.controller';
import { HealthController } from '@controllers/health.controller';
import { IndexController } from '@controllers/index.controller';
import { OrganizationController } from '@controllers/organization.controller';
import { TemplateController } from '@controllers/template.controller';
import { UserController } from '@controllers/user.controller';
import { initRedis } from '@utils/initRedis';
import validateEnv from '@utils/validateEnv';

validateEnv();

async function bootstrap() {
  // Connects Redis only when SESSION_STORE=redis; App then builds the session store from it.
  await initRedis();

  const app = new App([
    IndexController,
    UserController,
    HealthController,
    ChecklistController,
    EmployeeController,
    OrganizationController,
    TemplateController,
  ]);

  app.listen();
}

bootstrap().catch(err => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
