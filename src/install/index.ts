import { Rule, SchematicContext, Tree, chain, SchematicsException } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { getJsonFile } from '../utils';

export default function install(_options: any): Rule {
  return chain([
    addDependencies(),
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
