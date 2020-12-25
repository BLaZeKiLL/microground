import { Tree } from '@angular-devkit/schematics';
import { readNxJsonInTree, readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';

import { runSchematic } from "../../testing/testing";
import { ApplicationSchematicSchema } from "./schema";

describe('init schematic', () => {

  const app_name = 'wc-demo';

  let tree: Tree;

  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty());
  });

  it('should create a web-component angular application', async () => {
    try {
      await runSchematic('application', {
        name : app_name
      } as ApplicationSchematicSchema, tree);
    } catch (error) {
      console.error(error);
      throw error;
    }

    const nx = readNxJsonInTree(tree);
    const workspace = readJsonInTree(tree, 'workspace.json');

    expect(nx.projects).toHaveProperty(app_name);
    expect(nx.projects).toHaveProperty(app_name + '-e2e');
  });

});
