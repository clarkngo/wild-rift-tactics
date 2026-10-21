import { baronMatchups } from './features/baron-matchups';

/** A top-level part of the site, mounted at `#/<route>/...`. */
export interface Section {
  route: string;
  title: string;
  navLabel: string;
  description: string;
  /** `params` are the hash path segments after the route. */
  render(app: HTMLElement, params: string[]): void;
}

/** Add new sections here; they appear in the header nav and on the home page. */
export const SECTIONS: Section[] = [baronMatchups];
