import {
  apply,
  applyTemplates,
  externalSchematic,
  chain,
  mergeWith,
  move,
  Rule,
  url,
  MergeStrategy
} from '@angular-devkit/schematics';

import {
  names,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toFileName,
  updateWorkspace,
} from '@nrwl/workspace';

import { renameWorkspaceToAngular, renameWorkspaceToNx } from '../../utils/workspace';
import { ApplicationSchematicSchema } from './schema';
import init from '../init/init';

interface NormalizedSchema extends ApplicationSchematicSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  options: ApplicationSchematicSchema
): NormalizedSchema {
  const name = toFileName(options.name);
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(ProjectType.Application)}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function updateFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(options.projectRoot),
    ]),
    MergeStrategy.Overwrite
  );
}

/**
 * - create angular application
 * - modify build and serve targets and scripts array
 * - update nx.json
 * - install angular elements, webcomponent pollyfills
 * - run @angular/elements ng-add schematic
 * - modify files
 *  - add webpack.config.js
 *  - modify app module
 * @param input scheamtic execution options
 */
export default function (input: ApplicationSchematicSchema): Rule {
  const options = normalizeOptions(input);

  return chain([
    init(options),
    externalSchematic('@nrwl/angular', 'application', {
      ...options,
      root: options.projectRoot,
      sourceRoot: `${options.projectRoot}/src`,
    }),
    renameWorkspaceToAngular,
    externalSchematic('ngx-build-plus', 'wc-polyfill', { project: options.projectName }),
    renameWorkspaceToNx,
    updateWorkspace(workspace => {
      const project = workspace.projects.get(options.projectName);

      const build_target = project.targets.get('build');

      const t_options = build_target.options;
      const t_config = build_target.configurations;

      const wc_scripts = [...(t_options.scripts as [])];
      const prod_config = t_config.production;
      const dev_config = t_config.development;

      delete t_options.scripts;
      prod_config.budgets[0].maximumWarning = '2mb';
      prod_config.budgets[0].maximumError = '4mb';

      project.targets.delete('build');
      project.targets.delete('serve');

      project.targets.add({
        name: 'build',
        builder: 'ngx-build-plus:browser',
        options: {
          ...t_options,
          singleBundle: true
        },
        configurations: {
          "production-external": {
            ...prod_config,
            extraWebpackConfig: `${options.projectRoot}/webpack/webpack-external.config.js`,
            scripts: [
              "node_modules/rxjs/bundles/rxjs.umd.js",
              "node_modules/@angular/core/bundles/core.umd.js",
              "node_modules/@angular/common/bundles/common.umd.js",
              "node_modules/@angular/common/bundles/common-http.umd.js",
              "node_modules/@angular/compiler/bundles/compiler.umd.js",
              "node_modules/@angular/elements/bundles/elements.umd.js",
              "node_modules/@angular/platform-browser/bundles/platform-browser.umd.js",
              "node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
              ...wc_scripts
            ]
          },
          "production-bundle": {
            ...prod_config,
            extraWebpackConfig: `${options.projectRoot}/webpack/webpack-bundle.config.js`,
          },
          "development-external": {
            ...dev_config,
            extraWebpackConfig: `${options.projectRoot}/webpack/webpack-external.config.js`,
            scripts: [
              "node_modules/rxjs/bundles/rxjs.umd.js",
              "node_modules/@angular/core/bundles/core.umd.js",
              "node_modules/@angular/common/bundles/common.umd.js",
              "node_modules/@angular/common/bundles/common-http.umd.js",
              "node_modules/@angular/compiler/bundles/compiler.umd.js",
              "node_modules/@angular/elements/bundles/elements.umd.js",
              "node_modules/@angular/platform-browser/bundles/platform-browser.umd.js",
              "node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js",
              ...wc_scripts
            ]
          },
          "development-bundle": {
            ...dev_config,
            extraWebpackConfig: `${options.projectRoot}/webpack/webpack-bundle.config.js`,
          }
        },
        defaultConfiguration: 'development-bundle'
      });

      project.targets.add({
        name: 'serve',
        builder: '@codeblaze/nx-webcomponent:serve',
        options: {
          buildTarget: `${options.projectName}:build`
        }
      });
    }),
    updateFiles(options)
  ]);
}
