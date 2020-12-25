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
  addProjectToNxJsonInTree,
  names,
  offsetFromRoot,
  projectRootDir,
  ProjectType,
  toFileName,
  updateWorkspace,
} from '@nrwl/workspace';

import init from '../init/init';
import { ApplicationSchematicSchema } from './schema';

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
      name: options.projectName,
      root: options.projectRoot,
      sourceRoot: `${options.projectRoot}/src`,
    }),
    updateWorkspace((workspace) => {
      const project = workspace.projects.get(options.projectName);

      const build_target = project.targets.get('build');

      const t_options = build_target.options;
      const t_config = build_target.configurations;

      project.targets.delete('build');
      project.targets.delete('serve');

      project.targets.add({
        name: 'build',
        builder: 'ngx-build-plus:browser',
        options: {
          ...t_options,
          singleBundle: true,
          extraWebpackConfig: `${options.projectRoot}/webpack.config.js`,
          scripts: [
            "node_modules/rxjs/bundles/rxjs.umd.js",
            "node_modules/@angular/core/bundles/core.umd.js",
            "node_modules/@angular/common/bundles/common.umd.js",
            "node_modules/@angular/common/bundles/common-http.umd.js",
            "node_modules/@angular/compiler/bundles/compiler.umd.js",
            "node_modules/@angular/elements/bundles/elements.umd.js",
            "node_modules/@angular/platform-browser/bundles/platform-browser.umd.js",
            "node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js"
          ]
        },
        configurations: t_config
      });

      project.targets.add({
        name: 'serve',
        builder: '@codeblaze/nx-webcomponent:serve',
        options: {
          buildTarget: `${options.projectName}:build`
        }
      });
    }),
    addProjectToNxJsonInTree(options.projectName, {
      tags: options.parsedTags,
    }),
    externalSchematic('@angular/elements', 'ng-add', { project: options.projectName }),
    updateFiles(options)
  ]);
}
