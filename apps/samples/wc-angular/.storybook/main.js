/* eslint-disable */

/**
 * this file can be used for project level config of storybook
 * by extending the root
 */

const rootMain = require('../../../../.storybook/main');

// Use the following syntax to add addons!
// rootMain.addons.push('');
rootMain.stories.push(...['../src/app/**/*.stories.mdx', '../src/app/**/*.stories.@(js|jsx|ts|tsx)'])

module.exports = rootMain;
