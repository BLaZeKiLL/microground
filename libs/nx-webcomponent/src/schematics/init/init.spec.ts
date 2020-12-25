import { Tree } from '@angular-devkit/schematics';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';

import { runSchematic } from "../../testing/testing";

import { InitSchematicSchema } from "./schema";

describe('init schematic', () => {

  let appTree: Tree;

  beforeEach(() => {
    appTree = Tree.empty()
    appTree = createEmptyWorkspace(appTree);
  });

  it('should update package.json', async () => {
    const tree = await runSchematic('init', {} as InitSchematicSchema, appTree);

    const { dependencies, devDependencies } = readJsonInTree(tree, 'package.json');

    expect(dependencies).toHaveProperty('@angular/elements');
    expect(devDependencies).toHaveProperty('@nrwl/angular');
    expect(devDependencies).toHaveProperty('ngx-build-plus');
  });

});
