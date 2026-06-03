import { exec } from 'child_process';
import { promisify } from 'node:util';
import path from 'path';
import fs from 'node:fs';
import { config } from 'dotenv';
config({ path: ['.env.local', '.env'] });

const execAsync = promisify(exec);

const PATH_TO_OUTPUT_DIR = path.resolve(process.cwd(), './src/data-contracts');

const main = async () => {
  if (!fs.existsSync(`${PATH_TO_OUTPUT_DIR}/backend`)) {
    fs.mkdirSync(`${PATH_TO_OUTPUT_DIR}/backend`, { recursive: true });
  }
  console.log('Downloading and generating api-docs for backend');
  await execAsync(
    `curl -fsS -o ${PATH_TO_OUTPUT_DIR}/backend/swagger.json ${process.env.NEXT_PUBLIC_API_URL}/swagger.json`
  );
  const { stdout, stderr } = await execAsync(
    `npx swagger-typescript-api --modular -p ${PATH_TO_OUTPUT_DIR}/backend/swagger.json -o ${PATH_TO_OUTPUT_DIR}/backend --no-client --clean-output`
  );
  if (stderr) console.log(`stderr: ${stderr}`);
  console.log(`Data-contract-generator: ${stdout}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
