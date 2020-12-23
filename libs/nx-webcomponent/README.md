# nx-webcomponent

[Nx](https://nx.dev) plugin to create angular web components

## Installing
just run this in a nx workspace

`npm install --save-dev @nrwl/angular @angular/elements @codeblaze/nx-webcomponent`

peer dependencies
- `@nrwl/workspace` - will be installed in a nx workspace already
- `@nrwl/angular` - for creating angular projects using nx
- `@angular/elements` - should be of the same version as angular that you are using

## Getting Started
nx console is recommend for vs code

- `nx g @codeblaze/nx-webcomponent:application ${project-name}` creates a application
- `nx serve ${project-name}` serves the application

## Capabilities
- Generators
  - Application - creates a angular elements application configured with [ngx-build-plus](https://www.npmjs.com/package/ngx-build-plus)

- Executors
  - Serve - builds and serves a angular web component project

## More Info
- for build and webpack config take a look at [ngx-build-plus](https://www.npmjs.com/package/ngx-build-plus)
