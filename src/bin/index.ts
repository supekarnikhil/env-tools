#!/usr/bin/env node
/* eslint-disable import/first, no-console */

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
require("module-alias").addAlias("@root", `${__dirname}/..`);

import { Command } from "commander";
import { ConfigManager } from "@root/lib/ConfigManager";
import { DotEnvComparator } from "@root/lib/DotEnvComparator";
import { InputRequester, QuestionAnswer } from "@root/lib/InputRequester";
import { DotEnvBuilder } from "@root/lib/DotEnvBuilder";
import { appendFile } from "@root/lib/FileManager";

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
  .option("-q, --quiet", "exit with an error if any")
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

if (!isQuietMode && extraKeysInDotEnv.length) {
  console.warn(
    CONSOLE_TEXT_COLORS.yellow,
    `Warn: Extra config ${extraKeysInDotEnv.join(
      ", "
    )} found. Please consider updating the ${configManager.getEnvSchemaFilePath()} file.`,
    CONSOLE_TEXT_COLORS.reset
  );
}

if (missingKeysInDotEnv.length) {
  console.error(
    CONSOLE_TEXT_COLORS.red,
    `Error: Missing config keys detected.\n${missingKeysInDotEnv.join(", ")}
    \nPlease provide the required values for the respective keys.\n`,
    CONSOLE_TEXT_COLORS.reset
  );

  if (isQuietMode) {
    process.exit(1);
  }

  InputRequester(missingKeysInDotEnv, secreteKeys)
    .then((result: QuestionAnswer[]) => {
      const dotEnvData = DotEnvBuilder(result);

      appendFile(configManager.getEnvFilePath(), dotEnvData);
    })
    .catch((e) => {
      console.log(e);
    });
}
