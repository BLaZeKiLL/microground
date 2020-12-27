import {
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('nx-webcomponent e2e', () => {

  it('should create nx-webcomponent application and be able to build it', async (done) => {
    const plugin = uniq('webcomponents');

    ensureNxProject(
      '@codeblaze/nx-webcomponent',
      'dist/libs/nx-webcomponent'
    );

    await runNxCommandAsync(
      `generate @codeblaze/nx-webcomponent:application ${plugin} --no-interactive`
    );

    expect(Object.keys(readJson('nx.json').projects)).toContain(plugin);

    const result = await runNxCommandAsync(`build ${plugin}`);

    expect(result.stdout).toContain(`nx build ${plugin}`);
    expect(result.stdout).toContain('scripts.js');
    expect(result.stdout).toContain('polyfills.js');
    expect(result.stdout).toContain('main.js');
    expect(result.stdout).toContain('styles.css');
    expect(result.stdout).not.toContain('vendor.js');
    expect(result.stdout).not.toContain('runtime.js');

    done();
  }, 500000);

});
