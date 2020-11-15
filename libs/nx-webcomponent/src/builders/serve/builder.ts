import {
  BuilderContext,
  createBuilder,
  scheduleTargetAndForget,
  targetFromTargetString
} from '@angular-devkit/architect';

import * as path from 'path';
import * as cp from 'child_process';

import { concat, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServeBuilderSchema } from './schema';

export default createBuilder((_options : ServeBuilderSchema, context : BuilderContext) => {
  // use webpack dev server
  const http_server = `${path.join(context.workspaceRoot, 'node_modules', '.bin', 'http-server')}`;
  const http_root = `${path.join(context.workspaceRoot, 'dist', 'apps', 'samples', 'wc-angular')}`;

  const server = cp.spawn(http_server, [http_root, '-p 3200', '-a localhost', '-s'], { cwd: __dirname, shell: true });

  //server.stdout.on('data', data => context.logger.info(data.toString()));

  context.logger.info(`\x1b[33mServing : \x1b[0m\x1b[34m${http_root}\x1b[0m`);
  context.logger.info(`\x1b[33mAvailable on : \x1b[0m\x1b[32mhttp://localhost:3200\x1b[0m`);

  return concat(
    new Observable<unknown>(observer => {
      server.on('close', code => {
        observer.next({ success: code === 0 });
        observer.complete();
      });
    }),
    scheduleTargetAndForget(
      context,
      targetFromTargetString(`${context.target.project}:build`),
      { watch: true }
    ),
  ).pipe(
    map(([ build_context, server_context ]) => ({ success: build_context.success && server_context.success }))
  );
});
