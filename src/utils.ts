import { Tree, SchematicsException } from "@angular-devkit/schematics";

/**
 * Returns the parsed content of a json file.
 * @param host {Tree} The source directory tree
 * @param path {String} The path to the file to read. Relative to the root of the tree.
 */
export function getJsonFile(host: Tree, path: string) {
    const buffer = host.read(path);
    if (buffer === null) {
      throw new SchematicsException(`Couldn't read ${path}!`);
    }

    const content = buffer.toString('utf-8');
    try {
        const json = JSON.parse(content);
        return json;
    } catch(e) {
        throw new SchematicsException(`Couldn't parse ${path}!`)
    }
}
