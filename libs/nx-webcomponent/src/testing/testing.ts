import { Tree } from '@angular-devkit/schematics';
import { JsonObject } from '@angular-devkit/core';
import { join } from 'path';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';

const runner = new SchematicTestRunner(
  '@codeblaze/nx-webcomponent',
  join(__dirname, '../../collection.json')
);


export function runSchematic<SchemaOptions = JsonObject>(
  schematicName: string,
  options: SchemaOptions,
  tree: Tree
) {
  return runner.runSchematicAsync(schematicName, options, tree).toPromise();
}
