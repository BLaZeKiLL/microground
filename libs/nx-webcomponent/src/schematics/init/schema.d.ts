import { JsonObject } from '@angular-devkit/core';

export interface InitSchematicSchema extends JsonObject {
  skipInstall?: boolean;
}
