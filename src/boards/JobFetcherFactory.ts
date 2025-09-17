import { LinkedinFilterer } from "@/filters/LinkedinFilterer";
import { Database } from "sqlite3";
import { LinkedinFetcher } from "./LinkedinFetcher";
import { Filterer } from "@/filters/JobFilterer";

export class JobFetcherFactory {
  #config: Config;
  #db: Database;

  constructor(config: Config, db: Database) {
    this.#config = config;
    this.#db = db;
  }

  createFetcher(source: JobBoards): JobFetcher {
    const filter = this.#createFilter(source);
    switch (source) {
      case "linkedin":
        return new LinkedinFetcher(
          this.#config.linkedInConfig.linkedInParams,
          filter
        );
      default:
        throw new Error(`Have not implemented fetcher for source: ${source}`);
    }
  }

  #createFilter(source: JobBoards): Filterer {
    switch (source) {
      case "linkedin":
        return new LinkedinFilterer(this.#db, this.#config.blacklist);
      default:
        throw new Error(`Have not implemented filter for source: ${source}`);
    }
  }
}
