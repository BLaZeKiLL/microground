import { JsonObject } from '@angular-devkit/core';

export interface ApplicationSchematicSchema extends JsonObject {
  name: string;
  tags?: string;
  directory?: string;
  skipInstall?: boolean;

  skipFormat: boolean;
  inlineStyle?: boolean;
  inlineTemplate?: boolean;
  viewEncapsulation?: 'Emulated' | 'Native' | 'None';
  routing?: boolean;
  enableIvy?: boolean;
  prefix?: string;
  style?: string;
  skipTests?: boolean;
  linter: Linter;
  unitTestRunner: UnitTestRunner;
  e2eTestRunner: E2eTestRunner;
  backendProject?: string;
  strict?: boolean;
}
