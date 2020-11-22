import {
  apply,
  applyTemplates,
  externalSchematic,
  chain,
  mergeWith,
  move,
  Rule,
  url,
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
import { NxWebcomponentSchematicSchema } from './schema';

/**
 * Depending on your needs, you can change this to either `Library` or `Application`
 */
const projectType = ProjectType.Library;

interface NormalizedSchema extends NxWebcomponentSchematicSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  options: NxWebcomponentSchematicSchema
): NormalizedSchema {
  const name = toFileName(options.name);
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
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

function modifyFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.name),
        offsetFromRoot: offsetFromRoot(options.projectRoot),
      }),
      move(options.projectRoot),
    ])
  );
}

/**
 * - create angular application
 * - modify build and serve targets and scripts array
 * - update nx.json
 * - install angular elements
 * - run angular elements install schematic on the new project
 * - modify files
 *  - add webpack.config.js
 *  - modify app module
 * @param options
 */
export default function (options: NxWebcomponentSchematicSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  return chain([
    externalSchematic('@nrwl/angular', 'application', {
      name: normalizedOptions.projectName,
      root: normalizedOptions.projectRoot,
      sourceRoot: `${normalizedOptions.projectRoot}/src`,
      projectType,
    }),
    updateWorkspace((workspace) => { // update workspace.json
      const project = workspace.projects.get(normalizedOptions.projectName);

      const build_target = project.targets.get('build');

      const t_options = build_target.options;
      const t_config = build_target.configurations;

      project.targets.delete('build');
      project.targets.delete('serve');

      project.targets.add({
        name: 'build',
        builder: 'ngx-build-plus:browser',
        options: t_options,
        configurations: t_config
      });

      project.targets.add({
        name: 'serve',
        builder: '@microground/nx-webcomponent:serve',
        options: {
          buildTarget: `${normalizedOptions.projectName}:build`
        }
      });
    }),
    addProjectToNxJsonInTree(normalizedOptions.projectName, { // update nx.json
      tags: normalizedOptions.parsedTags,
    }),
    // generate angular project
    modifyFiles(normalizedOptions), // add custom files
  ]);
}
