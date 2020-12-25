import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';

import {
  Tree,
  readJson,
} from '@nrwl/devkit';

import schematic from './init';
import { InitGeneratorSchema } from './schema';

describe('init schematic', () => {

  let appTree: Tree;
  const options: InitGeneratorSchema = { };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', () => {
    schematic(options);

    const { dependencies, devDependencies } = readJson(appTree, 'package');

    expect(dependencies).toHaveProperty('@angular/elements');
    expect(devDependencies).toHaveProperty('@nrwl/angular');
    expect(devDependencies).toHaveProperty('ngx-build-plus');
  });

});
