# env-tools

A node.js module with some tools to validate env specific file of your project.

This tool compares your env file with your schema file.

If any missing keys are found, then it throws an error on the console and requests you to enter the respective missing values.
This can be disabled with `-q` or `--quiet` option.

If any additional key is found in the env file which is not specified in the schema file,
then only a warning will be shown on the console if the quiet option is not set.

## Install

Install as a dev-dependency

```bash
npm install @nixup/env-tools --save-dev
```

Or installing with yarn? `yarn add --dev @nixup/env-tools`

## Usage

- Example 1:
  If you have `.env.schema` file in the current working directory,
  and you want to check whether all the keys specified in the schema file are there in the .env file or not.

sample `.env.schema` file

```
PUBLIC_KEY=
PRIVATE_KEY=*
ANOTHER_SECRETE_KEY=*
WEBSITE_URL=
```

then with **npx** you can run

```bash
npx env-tools
```

- Example 2:
  run in quiet mode, it will only throw an error if any missing keys are found or exit without any error or warning

```bash
npx env-tools -q
```

You can also add this to prebuild script in your package.json, so that it will execute every time before the build script is executed.

```
prebuild: env-tools -q
```

- Example 3:
  you can specify different env and schema file path

```bash
npx env-tools -e ./src.env.local -s ./src/.env.schema
```

## Default configuration

```json
{
  "envFilePath": "./.env",
  "envSchemaFilePath": "./.env.schema",
  "charEncoding": "utf8"
}
```

You can override these settings by adding the file `env-config.json` in the same directory from where you are going to run the env-tool command. Or you can also provide a custom configuration file path with `-c` option.

`env-config.json` take precedence over the default configuration and if custom config file path is also provided with option `-c`, then that configuration will take precedence over the other configurations.

## Available command arguments

The options specified here precede the default configurations.

```
-c, --config-path <string>", "default config file path"
-e, --env-path <string>", "target env file path"
-s, --schema-path <string>", "env schema file path"
-q, --quiet", "exit with an error if there is any error or warning"
```

1. `-c` or `--config-path`: provide an alternative configuration file path. This will only override the above default configuration.
   ex. you can only override envFilePath and envSchemaFilePath in your configuration.

`env-config.json`

```json
{
  "envFilePath": "./src/.env.local",
  "envSchemaFilePath": "./src/.env.schema"
}
```

```bash
npx env-tools --config-path=env-config.json
```

2. `-e` or `--env-path`: you can give the location of the env file and override the path specified in the default configuration.

3. `-s` or `--schema-path`: you can give the location of the env-schema file and override the path specified in the default configuration.

4. `-q` or `--quiet`: if you specify this option and there are missing or extra keys, the tool will exit with error code 1. And it will not ask for missing keys.
