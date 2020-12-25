import { Tree } from '@angular-devkit/schematics';
import { readJsonInTree } from '@nrwl/workspace';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';

import { runSchematic } from "../../testing/testing";

describe('init schematic', () => {

  let tree: Tree;

  beforeEach(() => {
    tree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await runSchematic('init', {}, tree);

    const { dependencies, devDependencies } = readJsonInTree(tree, 'package.json')

    expect(dependencies).toHaveProperty('@angular/elements');
    expect(devDependencies).toHaveProperty('@nrwl/angular');
    expect(devDependencies).toHaveProperty('ngx-build-plus');
  });

});
