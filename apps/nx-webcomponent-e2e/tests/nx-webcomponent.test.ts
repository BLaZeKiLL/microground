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
      '@microground/nx-webcomponent',
      'dist/libs/nx-webcomponent'
    );

    await runNxCommandAsync(
      `generate @microground/nx-webcomponent:application ${plugin}`
    );

    expect(Object.keys(readJson('nx.json').projects)).toContain(plugin);

    const result = await runNxCommandAsync(`build ${plugin}`);

    expect(result.stdout).toContain(`nx build ${plugin}`);
    expect(result.stdout).toContain('chunk {main} main.js, main.js.map (main)');
    expect(result.stdout).toContain('chunk {polyfills} polyfills.js, polyfills.js.map (polyfills)');
    expect(result.stdout).toContain('chunk {styles} styles.js, styles.js.map (styles)');
    expect(result.stdout).toContain('chunk {scripts} scripts.js, scripts.js.map (scripts)');

    done();
  }, 500000);

});
