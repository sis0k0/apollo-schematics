import { dirname } from 'path';
import {
  apply,
  chain,
  url,
  template,
  Tree,
  Rule,
  SchematicContext,
  mergeWith,
  move,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { getAppModulePath } from '@schematics/angular/utility/ng-ast-utils';

import { getJsonFile } from '../utils';
import { getMainPath } from '../project-utils';
import { Schema } from './schema';

export default function install(options: Schema): Rule {
  return chain([
    addDependencies(),
    addSetupFiles(options),
  ]);
}

/**
 * Add all necessary node packages
 * as dependencies in the package.json
 */
function addDependencies() {
  return (host: Tree, context: SchematicContext) => {
    const packageJsonPath = 'package.json';
    const packageJson = getJsonFile(host, packageJsonPath);

    packageJson.dependencies = packageJson.dependencies || {};
    const dependenciesToAdd = [
      'apollo-angular',
      'apollo-angular-link-http',
      'apollo-link',
      'apollo-client',
      'apollo-cache-inmemory',
      'graphql-tag',
      'graphql',
    ];
    dependenciesToAdd.forEach(dependency => {
      if (!packageJson.dependencies[dependency]) {
        // target the 'latest' tag of every package
        packageJson.dependencies[dependency] = 'latest';
      }
    });

    // save the changed file
    host.overwrite(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // schedule `npm install`
    context.addTask(new NodePackageInstallTask());

    return host;
  }
}

function addSetupFiles(options: Schema) {
  return (host: Tree) => {
    const mainPath = getMainPath(host, options.project);
    const appModulePath = getAppModulePath(host, mainPath);
    const appModuleDirectory = dirname(appModulePath);

    const templateSource = apply(url('./files'), [
      template({}),
      move(appModuleDirectory),
    ]);

    return mergeWith(templateSource);
  };
}
