# @lacolaco/ngx-web-bundles

# VERY EXPERIMENTAL! BE CAREFUL TO USE!

Angular CLI builder for generate Web Bundle file (.wbn).
To learn about Web Bundles, read https://web.dev/web-bundles.

This tool is created for just trying new (experimental) web proposal with Angular CLI, and investigating the design for integration.

**PLEASE DON'T RELY ON THIS ANYWAY!!**

## Usage

See the `testapp` directory for example.

### Install the builder

```
$ yarn add -D @lacolaco/ngx-web-bundles
```

### Add the architect command to your `angular.json`.

- `options.browserTarget`: Identify target configuration for building app.
- `options.primaryURL`: Tell the primary URL to the Web Bundle. (used by browser)

```
...
      "architect": {
        "gen-bundle": {
          "builder": "@lacolaco/ngx-web-bundles:generate:production",
          "options": {
            "browserTarget": "testapp:build",
            "primaryURL": "https://example.com/"
          }
        },
...
```

### Run it

Execute the command;

```
$ ng run testapp:gen-bundle
```
