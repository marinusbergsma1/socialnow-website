// Alle projecten (11 oktober 2026 uit content.ts gehaald: data/projects.ts hoort niet in het eerste script).
import { allProjects, webShowcaseProjects } from "../data/projects";
export const projects = [...webShowcaseProjects, ...allProjects];
