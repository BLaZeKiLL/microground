import { Tree } from '@angular-devkit/schematics';
import { readNxJsonInTree, readWorkspace } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';

import { runSchematic } from "../../testing/testing";
import { ApplicationSchematicSchema } from "./schema";

describe('init schematic', () => {

  const app_name = 'wc-demo';

  let appTree: Tree;

  beforeEach(() => {
    appTree = Tree.empty()
    appTree = createEmptyWorkspace(appTree);
  });

  it('should create a web-component angular application', async () => {
    const tree = await runSchematic('application', {
      name : app_name
    } as ApplicationSchematicSchema, appTree);

    const workspace = readWorkspace(tree);
    const nx = readNxJsonInTree(tree);
    const project = workspace.projects[app_name];

    expect(nx.projects).toHaveProperty(app_name);
    expect(nx.projects).toHaveProperty(app_name + '-e2e');

    expect(workspace.projects).toHaveProperty(app_name);
    expect(workspace.projects).toHaveProperty(app_name + '-e2e');

    expect(project.architect.build.builder).toBe('ngx-build-plus:browser');
    expect(project.architect.serve.builder).toBe('@codeblaze/nx-webcomponent:serve');
  });

});
