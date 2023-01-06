#!/usr/bin/env node
import { Command } from "commander";
import { ConfigManager } from "../lib/ConfigManager";
import { DotEnvComparator } from "../lib/DotEnvComparator";
import { InputRequester } from "../lib/InputRequester";
import { DotEnvBuilder } from "../lib/DotEnvBuilder";
import { appendFile } from "../lib/FileManager";

const CONSOLE_TEXT_COLORS = {
  red: "\x1b[31m%s\x1b[0m",
  yellow: "\x1b[33m%s\x1b[0m",
  reset: "\x1b[0m",
};

const program = new Command();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const { version, name, description } = require("../../package.json");

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
program.name(name).description(description).version(version);

program
  .option("-c, --config-path <string>", "default config file path")
  .option("-e, --env-path <string>", "target env file path")
  .option("-s, --schema-path <string>", "env schema file path")
  .option("-q, --quiet", "exit with an error if there is any error or warning")
  .parse();

const options = program.opts();
const { configPath, envPath, schemaPath, quiet } = options;

const configManager = new ConfigManager(configPath);

if (typeof envPath === "string") {
  configManager.setEnvFilePath(envPath);
}

if (typeof schemaPath === "string") {
  configManager.setEnvSchemaFilePath(schemaPath);
}

if (typeof quiet === "boolean") {
  configManager.setIsQuietMode(quiet);
}

const { missingKeysInDotEnv, extraKeysInDotEnv, secreteKeys } = DotEnvComparator(
  configManager.getEnvFilePath(),
  configManager.getEnvSchemaFilePath()
);

const isQuietMode = configManager.getIsQuietMode();

if (extraKeysInDotEnv.length) {
  console.warn(
    CONSOLE_TEXT_COLORS.yellow,
    `Warning: Extra config keys found.\n${extraKeysInDotEnv.join(
      ", "
    )}\nPlease update ${configManager.getEnvSchemaFilePath()} file.\n`,
    CONSOLE_TEXT_COLORS.reset
  );

  if (isQuietMode) {
    process.exit(1);
  }
}

if (missingKeysInDotEnv.length) {
  console.error(
    CONSOLE_TEXT_COLORS.red,
    `Error: Missing config keys found.\n${missingKeysInDotEnv.join(", ")}
    \nPlease provide the required values for the respective keys.\n`,
    CONSOLE_TEXT_COLORS.reset
  );

  if (isQuietMode) {
    process.exit(1);
  }

  InputRequester(missingKeysInDotEnv, secreteKeys)
    .then((result) => {
      const dotEnvData = DotEnvBuilder(result);

      appendFile(configManager.getEnvFilePath(), dotEnvData);
    })
    .catch((e) => {
      console.log(e);
    });
}
