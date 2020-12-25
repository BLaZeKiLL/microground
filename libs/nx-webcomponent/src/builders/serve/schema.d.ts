import { JsonObject } from '@angular-devkit/core';

export interface ServeBuilderSchema extends JsonObject {
  buildTarget: string;
  port?: number;
  host?: string;
  silent?: boolean;
  watch?: boolean;
}
