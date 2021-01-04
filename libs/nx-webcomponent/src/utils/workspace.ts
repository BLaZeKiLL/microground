import { Rule } from '@angular-devkit/schematics';
import { renameSyncInTree } from '@nrwl/workspace';

export const renameWorkspaceToAngular: Rule = (tree) => {
  renameSyncInTree(tree, 'workspace.json', 'angular.json', (error) => {
    if (error) {
      console.error('can\'t rename workspace');
      console.error(error);
    }
  });
}

export const renameWorkspaceToNx: Rule = (tree) => {
  renameSyncInTree(tree, 'angular.json', 'workspace.json', (error) => {
    if (error) {
      console.error('can\'t rename workspace');
      console.error(error);
    }
  });
}
