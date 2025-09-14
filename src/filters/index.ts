import { FilterById } from "./sql";
import { FilterByTitle } from "./data";

export { FilterById };

// Filters jobs by several metrics.
// Only title for now...
export function FilterJobs(jobs: LinkedinJob[]) {
  let filtered = Array.from(jobs);

  filtered = FilterByTitle(filtered);
  return filtered;
}
