# @lacolaco/ngx-web-bundles

# VERY EXPERIMENTAL! BE CAREFUL TO USE!

Angular CLI builder for generate Web Bundle file (.wbn).
To learn about Web Bundles, read https://web.dev/web-bundles.

This tool is created for just trying new (experimental) web proposal with Angular CLI, and investigating the design for integration.

**PLEASE DON'T RELY ON THIS ANYWAY!!**

## Usage

See the `testapp` directory for example.

### 1. Install the builder

```
$ ng add @lacolaco/ngx-web-bundles
```

### 2. Run it

Execute the command;

```
$ ng run <project name>:gen-bundle
```

## Configuration

After `ng-add`, You can see the architect options in your `angular.json`.

- `options.browserTarget`: Identify target configuration for building app.
- `options.primaryURL`: Tell the primary URL to the Web Bundle. (used by browser)

```
...
      "architect": {
        "gen-bundle": {
          "builder": "@lacolaco/ngx-web-bundles:generate",
          "options": {
            "browserTarget": "testapp:build:production",
            "primaryURL": "https://ngx-web.bundles" // <= dummy URL
          }
        },
...
```
