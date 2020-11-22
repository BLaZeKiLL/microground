import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('nx-webcomponent e2e', () => {

  it('should create nx-webcomponent application', async (done) => {
    const plugin = uniq('webcomponents');

    console.log(`E2E name : ${plugin}`);

    ensureNxProject(
      '@microground/nx-webcomponent',
      'dist/libs/nx-webcomponent'
    );

    await runNxCommandAsync(
      `generate @microground/nx-webcomponent:application ${plugin}`
    );

    const result = await runNxCommandAsync(`build ${plugin}`);

    expect(result.stdout).toContain('Builder ran');

    done();
  }, 100000);

  // describe('--directory', () => {
  //   it('should create src in the specified directory', async (done) => {
  //     const plugin = uniq('nx-webcomponent');

  //     ensureNxProject(
  //       '@microground/nx-webcomponent',
  //       'dist/libs/nx-webcomponent'
  //     );

  //     await runNxCommandAsync(
  //       `generate @microground/nx-webcomponent:application ${plugin} --directory subdir`
  //     );

  //     expect(() =>
  //       checkFilesExist(`libs/subdir/${plugin}/src/index.ts`)
  //     ).not.toThrow();

  //     done();
  //   });
  // });

  // describe('--tags', () => {
  //   it('should add tags to nx.json', async (done) => {
  //     const plugin = uniq('nx-webcomponent');

  //     ensureNxProject(
  //       '@microground/nx-webcomponent',
  //       'dist/libs/nx-webcomponent'
  //     );

  //     await runNxCommandAsync(
  //       `generate @microground/nx-webcomponent:application ${plugin} --tags e2etag,e2ePackage`
  //     );

  //     const nxJson = readJson('nx.json');

  //     expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);

  //     done();
  //   });
  // });

});
