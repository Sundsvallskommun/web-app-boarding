import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from '@controllers/user.controller';
import { HealthController } from '@controllers/health.controller';
import { ChecklistController } from '@controllers/checklist.controller';
import { EmployeeController } from '@controllers/employee.controller';
import { OrganizationController } from './controllers/organization.controller';
import { TemplateController } from './controllers/template.controller';

validateEnv();

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
