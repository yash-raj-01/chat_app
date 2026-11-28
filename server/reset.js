// reset.js — delete the database so the next start re-seeds from data/chats.json
import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
for (const f of ["chat.db", "chat.db-wal", "chat.db-shm"]) {
  rmSync(fileURLToPath(new URL("./" + f, import.meta.url)), { force: true });
}
console.log("Database deleted. It will be re-seeded from data/chats.json.");
