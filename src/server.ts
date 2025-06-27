import app from "./app";
import {logger} from "@/lib/logger.ts";
import {appConfig} from "@/config/app.config.ts";

function main() {
    Bun.serve({
        port: appConfig.appPort,
        fetch: app.fetch,
        idleTimeout: 0
    })
    logger.info(`Server running on port ${appConfig.appPort}`)
}

main()