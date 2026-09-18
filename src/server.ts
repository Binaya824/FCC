import { createApp } from "./app";
import { connectDatabase } from "./infrastructure/database/mongodb";
import { env } from "./config/env";
import { logger } from "./infrastructure/logging/logger";

async function main() {
  await connectDatabase();

  const app = createApp();
  app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
  });
}

main().catch((err) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
