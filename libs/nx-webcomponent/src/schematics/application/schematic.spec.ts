import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { NxWebcomponentSchematicSchema } from './schema';

describe('nx-webcomponent schematic', () => {
  let appTree: Tree;
  const options: NxWebcomponentSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@microground/nx-webcomponent',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner
        .runSchematicAsync('nx-webcomponent', options, appTree)
        .toPromise()
    ).resolves.not.toThrowError();
  });
});
