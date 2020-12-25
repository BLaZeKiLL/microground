import { join } from 'path';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

const runner = new SchematicTestRunner(
  '@codeblaze/nx-webcomponent',
  join(__dirname, '../../collection.json')
);

