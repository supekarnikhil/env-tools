import { DotEnvFileLoader } from "../DotEnvFileLoader";

const getEnvFileKeys = (envFilePath: string) => Object.keys(DotEnvFileLoader(envFilePath));

const getExtraKeysFromSecondFile = (file1ArrayKeys: string[], file2ArrayKeys: string[]) =>
  file2ArrayKeys.filter((key) => file1ArrayKeys.indexOf(key) < 0);

const getIsSecreteKey = (schemaFilePath: string) => {
  const parsedSchema = DotEnvFileLoader(schemaFilePath);
  return Object.keys(DotEnvFileLoader(schemaFilePath)).filter((key) => parsedSchema[key] === "*");
};

const DotEnvComparator = (envFilePath: string, schemaFilePath: string) => {
  const envFileKeys = getEnvFileKeys(envFilePath);
  const schemaFileKeys = getEnvFileKeys(schemaFilePath);

  const missingKeysInDotEnv: string[] = getExtraKeysFromSecondFile(envFileKeys, schemaFileKeys);
  const extraKeysInDotEnv: string[] = getExtraKeysFromSecondFile(schemaFileKeys, envFileKeys);
  const secreteKeys: string[] = getIsSecreteKey(schemaFilePath);

  return {
    missingKeysInDotEnv,
    extraKeysInDotEnv,
    secreteKeys,
  };
};

export { DotEnvComparator, getEnvFileKeys, getExtraKeysFromSecondFile };
