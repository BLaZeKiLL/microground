import { JsonObject } from '@angular-devkit/core';

export interface ApplicationSchematicSchema extends JsonObject {
  name: string;
  tags?: string;
  directory?: string;
  skipInstall?: boolean;
}
