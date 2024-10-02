import fs from "fs";
import path from "path";

export function getRouteFilePaths(): string[] {
  const routesFolderPath = path.join(__dirname, "../routes");
  const filePaths = fs
    .readdirSync(routesFolderPath)
    .filter(
      (file: string) =>
        !file.startsWith("_") && (file.endsWith(".js") || file.endsWith(".ts"))
    )
    .map((file: string) => path.join(routesFolderPath, file));
  return filePaths;
}

export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}