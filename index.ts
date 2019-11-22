import {
  BuilderContext,
  createBuilder,
  targetFromTargetString
} from "@angular-devkit/architect";
import {
  BrowserBuilderOptions,
  executeBrowserBuilder
} from "@angular-devkit/build-angular";
import { JsonObject } from "@angular-devkit/core";
import * as fs from "fs";
import * as glob from "glob";
import * as mime from "mime";
import * as path from "path";
import * as rimraf from "rimraf";
import { BundleBuilder } from "wbn";

interface Options extends JsonObject {
  browserTarget: string;
  primaryURL: string;
  outputPath: string | null;
}

async function generateWebBundle(
  distDir: string,
  primaryURL: string,
  output: string
) {
  primaryURL = primaryURL.endsWith("/") ? primaryURL : primaryURL + "/";

  const wbnBuilder = new BundleBuilder(primaryURL);
  glob.sync(`${distDir}/*`).forEach(file => {
    const requestURL = primaryURL + path.relative(distDir, file);
    wbnBuilder.addExchange(
      requestURL,
      200,
      { "Content-Type": mime.getType(file) || "text/plain" },
      fs.readFileSync(file)
    );
  });
  wbnBuilder.addExchange(
    primaryURL,
    200,
    { "Content-Type": "text/html" },
    fs.readFileSync(`${distDir}/index.html`)
  );
  fs.writeFileSync(path.resolve(distDir, output), wbnBuilder.createBundle());
  return;
}

async function build(options: Options, context: BuilderContext) {
  const browserTarget = targetFromTargetString(options.browserTarget);
  const browserTargetOptions = ((await context.getTargetOptions(
    browserTarget
  )) as unknown) as BrowserBuilderOptions;

  context.logger.info(`Initializing.`);
  rimraf.sync(browserTargetOptions.outputPath);
  context.logger.info(`Building app.`);
  const { outputPath } = await executeBrowserBuilder(
    {
      ...browserTargetOptions,
      baseHref: options.primaryURL, // NOTE: workaround for chrome's bug
    },
    context
  ).toPromise();

  context.logger.info(`Generating Web Bundle.`);
  const wbnOutputPath =
    options.outputPath || path.resolve(outputPath, "out.wbn");
  await generateWebBundle(outputPath, options.primaryURL, wbnOutputPath);

  context.logger.info(
    `Web Bundle file has been generated at ${wbnOutputPath} .`
  );
  context.reportStatus(`Done.`);
  return { success: true };
}

export default createBuilder(build);
