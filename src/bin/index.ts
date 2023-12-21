#!/usr/bin/env node
import { Command } from "commander";
import { ConfigManager } from "../lib/ConfigManager";
import { DotEnvComparator } from "../lib/DotEnvComparator";
import { InputRequester } from "../lib/InputRequester";
import { DotEnvBuilder } from "../lib/DotEnvBuilder";
import { appendFile, fileExists } from "../lib/FileManager";

let isErrorFound = false;
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
  .option(
    "-c, --config-path <string>",
    "Provide an alternative configuration file path to override default configuration options."
  )
  .option("-e, --env-path <string>", "Specify a custom path to the env file.")
  .option("-s, --schema-path <string>", "Specify a custom path to the env schema file.")
  .option(
    "-q, --quiet",
    "Exit with an error if missing or extra keys are found, without prompting for missing values."
  )
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

const envFilePath = configManager.getEnvFilePath();
const envSchemaFilePath = configManager.getEnvSchemaFilePath();

if (!fileExists(envFilePath)) {
  isErrorFound = true;
  console.warn(
    CONSOLE_TEXT_COLORS.yellow,
    `Warning: file ${envFilePath} does not exist.\n`,
    CONSOLE_TEXT_COLORS.reset
  );
}

if (!fileExists(envSchemaFilePath)) {
  isErrorFound = true;
  console.warn(
    CONSOLE_TEXT_COLORS.yellow,
    `Warning: file ${envSchemaFilePath} does not exist.\n`,
    CONSOLE_TEXT_COLORS.reset
  );
}

const { missingKeysInDotEnv, extraKeysInDotEnv, secreteKeys } = DotEnvComparator(
  envFilePath,
  envSchemaFilePath
);

const isQuietMode = configManager.getIsQuietMode();

if (extraKeysInDotEnv.length) {
  isErrorFound = true;
  console.warn(
    CONSOLE_TEXT_COLORS.yellow,
    `Warning: Following extra config keys found.\n${extraKeysInDotEnv.join(
      ", "
    )}\nPlease update ${configManager.getEnvSchemaFilePath()} file.\n`,
    CONSOLE_TEXT_COLORS.reset
  );

  if (isQuietMode) {
    process.exit(1);
  }
}

if (missingKeysInDotEnv.length) {
  isErrorFound = true;
  console.error(
    CONSOLE_TEXT_COLORS.red,
    `Error: Following missing config keys found.\n${missingKeysInDotEnv.join(", ")}
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

if (!isErrorFound) {
  console.log("\nNo error found!\n");
}
