import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const environment = process.env.NODE_ENV.toLowerCase();
const yaml_config = `${environment}.yaml`;

export default () => {
    return yaml.load(
        readFileSync(join(__dirname, 'config', yaml_config), 'utf8'),
    )as Record<string, any>
}