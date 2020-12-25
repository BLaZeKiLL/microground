import { JsonObject } from '@angular-devkit/core';

export interface NxWebcomponentSchematicSchema extends JsonObject {
  name: string;
  tags?: string;
  directory?: string;
  skipInstall?: boolean;
}
