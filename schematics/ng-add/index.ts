import {
  Rule,
  SchematicContext,
  Tree,
  SchematicsException,
  chain
} from "@angular-devkit/schematics";
import {
  getWorkspace,
  updateWorkspace
} from "@schematics/angular/utility/config";
import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks";

// Just return the tree
export function ngAdd(_options: any): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const projectName = workspace.defaultProject
      ? workspace.defaultProject
      : Object.keys(workspace.projects)[0];
    const project = workspace.projects[projectName];

    if (project.projectType !== "application") {
      throw new SchematicsException(
        `Deploy requires an Angular project type of "application" in angular.json`
      );
    }

    project.architect!["gen-bundle"] = {
      builder: "@lacolaco/ngx-web-bundles:generate",
      options: {
        browserTarget: `${projectName}:build:production`,
        primaryURL: `https://ngx-web.bundles`
      }
    };

    return chain([
      updateWorkspace(workspace),
      () => {
        context.logger.info(
          `gen-bundle architect has successfully installed! Let's execute "ng run ${projectName}:gen-bundle" command!`
        );
      }
    ]);
  };
}
