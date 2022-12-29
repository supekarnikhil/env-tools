import fs from "fs";
import path from "path";
import defaultConfig from "../../config/default-config.json";

type ConfigJson = {
  envFilePath: string;
  envSchemaFilePath: string;
  charEncoding: BufferEncoding | string;
};

export class ConfigManager {
  private isQuietMode = false;

  private configJson: ConfigJson = defaultConfig;

  private charEncoding: BufferEncoding | string;

  private envFilePath: string;

  private envSchemaFilePath: string;

  constructor(customConfigFilePath: string | unknown) {
    if (typeof customConfigFilePath === "string" && fs.existsSync(customConfigFilePath)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require, @typescript-eslint/no-unsafe-assignment
      this.configJson = { ...defaultConfig, ...require(path.resolve(customConfigFilePath)) };
    }

    const { charEncoding, envFilePath, envSchemaFilePath } = this.configJson;

    this.charEncoding = charEncoding;
    this.envFilePath = envFilePath;
    this.envSchemaFilePath = envSchemaFilePath;
  }

  getCharEncoding() {
    return this.charEncoding;
  }

  setCharEncoding(charEncoding: BufferEncoding) {
    this.charEncoding = charEncoding;
  }

  getEnvFilePath() {
    return this.envFilePath;
  }

  setEnvFilePath(envFilePath: string) {
    this.envFilePath = envFilePath;
  }

  getEnvSchemaFilePath() {
    return this.envSchemaFilePath;
  }

  setEnvSchemaFilePath(envSchemaFilePath: string) {
    this.envSchemaFilePath = envSchemaFilePath;
  }

  getIsQuietMode() {
    return this.isQuietMode;
  }

  setIsQuietMode(isQuietMode: boolean) {
    this.isQuietMode = isQuietMode;
  }
}
