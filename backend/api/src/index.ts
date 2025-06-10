import app from "./app";
import { config } from "./config/config";

app.listen(config.appPort, () => {
    const host = `http://localhost:${config.appPort}/`;
    console.log("\x1b[1m\x1b[32m  BE Server running!\x1b[0m");
    console.log(`\x1b[1m\x1b[32m  ➜  Local:\x1b[0m`, `\x1b[94m${host}\x1b[0m`);
});
