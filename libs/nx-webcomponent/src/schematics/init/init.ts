import {
  chain,
  Rule,
} from '@angular-devkit/schematics';

import {
  addDepsToPackageJson,
  readJsonFile
} from '@nrwl/workspace';

import { angularVersion } from '@nrwl/angular/src/utils/versions';

import { InitGeneratorSchema } from './schema';

function updateDependencies(options : InitGeneratorSchema) : Rule {
  const nx_version = readJsonFile('package.json').devDependencies['@nrwl/workspace'];

  return addDepsToPackageJson({
    '@angular/elements' : angularVersion
  }, {
    '@nrwl/angular': nx_version,
    'ngx-build-plus' : '*',
  }, !options.skipInstall)
}

export default function (options : InitGeneratorSchema) : Rule {
  return chain([
    updateDependencies(options)
  ]);
}
