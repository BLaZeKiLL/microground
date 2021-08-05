import {
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('nx-webcomponent', () => {

  const app = uniq('webcomponents');

  beforeAll(async () => {
    ensureNxProject(
      '@codeblaze/nx-webcomponent',
      'dist/libs/nx-webcomponent'
    );

    await runNxCommandAsync(
      `generate @codeblaze/nx-webcomponent:application ${app} --no-interactive`
    );
  }, 300000);

  it('should create nx-webcomponent application', () => {
    expect(Object.keys(readJson('nx.json').projects)).toContain(app);
  });

  describe('build', () => {
    it('production-external', async () => {
      const result = await runNxCommandAsync(`build ${app} -c production-external`);

      expect(result.stdout).toContain('scripts');
      expect(result.stdout).toContain('polyfills');
      expect(result.stdout).toContain('polyfill-webcomp');
      expect(result.stdout).toContain('polyfill-webcomp-es5');
      expect(result.stdout).toContain('main');
      expect(result.stdout).toContain('styles');

      expect(result.stdout).toContain(`Build`);
      expect(result.stdout).toContain(`Writing Bundle Info For : ${app}`);

      expect(result.stdout).not.toContain('vendor');
      expect(result.stdout).not.toContain('runtime');
    }, 200000);

    it('production-bundle', async () => {
      const result = await runNxCommandAsync(`build ${app} -c production-bundle`);

      expect(result.stdout).toContain('polyfills');
      expect(result.stdout).toContain('main');
      expect(result.stdout).toContain('styles');

      expect(result.stdout).toContain(`Build`);
      expect(result.stdout).toContain(`Writing Bundle Info For : ${app}`);

      expect(result.stdout).not.toContain('vendor');
      expect(result.stdout).not.toContain('runtime');
    }, 200000);

    it('development-external', async () => {
      const result = await runNxCommandAsync(`build ${app} -c development-external`);

      expect(result.stdout).toContain('scripts');
      expect(result.stdout).toContain('polyfills');
      expect(result.stdout).toContain('polyfill-webcomp');
      expect(result.stdout).toContain('polyfill-webcomp-es5');
      expect(result.stdout).toContain('main');
      expect(result.stdout).toContain('styles');

      expect(result.stdout).toContain(`Build`);
      expect(result.stdout).toContain(`Writing Bundle Info For : ${app}`);

      expect(result.stdout).not.toContain('vendor');
      expect(result.stdout).not.toContain('runtime');
    }, 200000);

    it('development-bundle', async () => {
      const result = await runNxCommandAsync(`build ${app} -c development-bundle`);

      expect(result.stdout).toContain('polyfills');
      expect(result.stdout).toContain('main');
      expect(result.stdout).toContain('styles');

      expect(result.stdout).toContain(`Build`);
      expect(result.stdout).toContain(`Writing Bundle Info For : ${app}`);

      expect(result.stdout).not.toContain('vendor');
      expect(result.stdout).not.toContain('runtime');
    }, 200000);
  });

});
