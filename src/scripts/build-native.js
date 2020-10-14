const { execSync } = require("child_process");
const semver = require("semver");

let nsMajorVersion;
try {
  const nsVersion = execSync("ns --version").toString().trim();

  const nsVersionMatches = nsVersion.match(/^(?:\d+\.){2}\d+.*?$/m);
  nsMajorVersion = semver.major((nsVersionMatches || [])[0]);
} catch (error) {
  console.error(`Execution failed: ns --version error: ${error}`);
  return;
}

// execute 'ns plugin build' for {N} version >= 7. This command builds .aar in platforms/android folder.
if (nsMajorVersion >= 7) {
  console.info(`executing 'ns plugin build'`);
  try {
    execSync("ns plugin build");
  } catch (error) {
    // Failed to execute the command.
    console.error(`Execution failed: ns plugin build: ${error}`);
  }
}
