import { config } from "..";
import { ENGINE_DIR } from "../constants";
import { log } from "../log";
import { configDispatch } from "../utils";
import { existsSync } from "node:fs";
import { join } from "node:path";

export const bootstrap = async () => {
  log.info(`Bootstrapping ${config.name}...`);

  const machPath = join(ENGINE_DIR, "mach");

  if (!existsSync(machPath)) {
    log.error(
      `The 'mach' command was not found in the expected location: ${machPath}. Please ensure that the 'mach' command is correctly installed and try again.`
    );
    return;
  }

  const arguments_ = ["--application-choice", "browser"];

  console.debug(`Passing through to |mach bootstrap|`);
  await configDispatch(machPath, {
    args: ["bootstrap", ...arguments_],
    cwd: ENGINE_DIR,
  });
};
