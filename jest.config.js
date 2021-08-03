const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    // '<rootDir>/libs/wc-fabric/core',
    // '<rootDir>/libs/wc-fabric/angular',
    // '<rootDir>/libs/nx-webcomponent',
    // '<rootDir>/apps/nx-webcomponent-e2e',
  ],
};
