# env-tools

A node.js module with some tools to validate env specific file of your project.

This tool compares your env file with your schema file.

If any missing keys found, then it throws error on console and requests you to enter the respective missing values.
This can be disabled with `-q` or `--quiet` option.

If any additional key is found in the env file which is not specified in the schema file,
then only a warning will be shown on the console, if quiet option is not set.

## Install

Install as a dev-dependency

```bash
npm install @nixup/env-tools --save-dev
```

Or installing with yarn? `yarn add --dev @nixup/env-tools`

## Usage

- Example 1:
  If you have `.env.schema` file in the current working directory,
  and you want to check whether all the keys specified in the schema file are there in the .env file or not,
  then you can execute this tool with npx

```
npx @nixup/env-tools
```

- Example 2:
  you can specify different env and schema file path

```
npx @nixup/env-tools -e ./src.env.local -s ./src/.env.schema
```

- Example 3:
  run in quiet mode, it will only throw error if any missing keys found or exits without any error or warning

```
npx @nixup/env-tools -q
```

You can also add this to prebuild script in package.json

```
prebuild: @nixup/env-tools -q
```

## Default configuration

```json
{
  "envFilePath": "./.env",
  "envSchemaFilePath": "./.env.schema",
  "charEncoding": "utf8"
}
```

## Available command arguements

The options specified in here precedes the default configurations.

```
-c, --config-path <string>", "default config file path"
-e, --env-path <string>", "target env file path"
-s, --schema-path <string>", "env schema file path"
-q, --quiet", "exit with error if any"
```

1. `-c` or `--config-path`: provide alternative configuration file path. This will only override the above default configuration.
   ex. you can only override envFilePath and envSchemaFilePath in your configuration.

`env-config.json`

```json
{
  "envFilePath": "./src/.env.local",
  "envSchemaFilePath": "./src/.env.schema"
}
```

```
npx @nixup/env-tools --config-path=env-config.json
```

2. `-e` or `--env-path`: you can give the location of the env file and override the path specified in the default configuration.

3. `-s` or `--schema-path`: you can give the location of the env-schema file and override the path specified in the default configuration.

4. `-q` or `--quiet`: if you specify this option, then you will not be asked
