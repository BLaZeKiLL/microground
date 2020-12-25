import { JsonObject } from '@angular-devkit/core';

export interface InitGeneratorSchema extends JsonObject {
  skipInstall?: boolean;
}
