import {
  BuilderContext,
  createBuilder,
  scheduleTargetAndForget,
  targetFromTargetString
} from '@angular-devkit/architect';

import * as path from 'path';
import * as cp from 'child_process';

import { concat, from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ServeBuilderSchema } from './schema';

export default createBuilder((options : ServeBuilderSchema, context : BuilderContext) => {
  const buildTarget = targetFromTargetString(options.buildTarget);

  // use @nrwl/web plugin
  return from(context.getTargetOptions(buildTarget))
    .pipe(
      switchMap(build => {
        const http_server = `${path.join(context.workspaceRoot, 'node_modules', '.bin', 'http-server')}`;
        const http_root = `${path.join(context.workspaceRoot, build.outputPath as string)}`;

        const args = [http_root, `-p ${options.port}`, `-a ${options.host}`, `--cors`];

        if (options.silent) {
          args.push('-s');
          context.logger.info(`\x1b[33mServing : \x1b[0m\x1b[34m${http_root}\x1b[0m`);
          context.logger.info(`\x1b[33mAvailable on : \x1b[0m\x1b[32mhttp://${options.host}:${options.port}\x1b[0m`);
        }

        const server = cp.spawn(http_server, args, { cwd: __dirname, shell: true });

        if (!options.silent) server.stdout.on('data', data => context.logger.info(data.toString()));

        return concat(
          new Observable<unknown>(observer => {
            server.on('close', code => {
              observer.next({ success: code === 0 });
              observer.complete();
            });
          }),
          scheduleTargetAndForget(
            context,
            buildTarget,
            { watch: options.watch }
          ),
        ).pipe(
          map(([ build_context, server_context ]) => ({ success: build_context.success && server_context.success }))
        );
      })
    );
});
