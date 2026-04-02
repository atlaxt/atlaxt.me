/**
 * to-public config
 *
 * outputPath: Output file path (relative to project root)
 * includeDependencies:
 *   false -> output only version + buildDate
 *   true  -> also output dependencies as a string[] (names only)
 */
module.exports = {
  outputPath: 'public/meta.json',
  includeDependencies: true,
}
