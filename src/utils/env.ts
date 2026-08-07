import path from 'path';
import fs from 'fs';
import { ConfigurationError, FileNotFoundError, JsonParseError } from './exceptions';

export type EnvConfig = {
  name: string;
  baseURL: string;
};

export function getEnvConfig(): EnvConfig {
  const env = (process.env.ENV || 'uat').toLowerCase();
  const file = path.resolve(__dirname, '..', 'configs', `${env}.json`);
  if (!fs.existsSync(file)) {
    throw new FileNotFoundError(`Environment config not found: ${file} (ENV=${env})`, 'getEnvConfig');
  }
  try {
    const raw = fs.readFileSync(file, 'utf8');
    const config = JSON.parse(raw) as EnvConfig;
    if (!config.baseURL) {
      throw new ConfigurationError(`baseURL is missing in environment config: ${file}`, 'getEnvConfig');
    }
    return config;
  } catch (error: any) {
    if (error instanceof ConfigurationError || error instanceof FileNotFoundError) throw error;
    throw new JsonParseError(`Failed to parse environment config ${file}: ${error.message}`, 'getEnvConfig');
  }
}