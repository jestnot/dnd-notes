import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/explorer.scss"

// @ts-ignore
import script from "./scripts/explorer.inline"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { FileTrieNode } from "../util/fileTrie"
import OverflowListFactory from "./OverflowList"
import { concatenateResources } from "../util/resources"
import { readSortSpecLines } from "../util/fileCache"

type OrderEntries = "sort" | "filter" | "map"

export interface Options {
  title?: string
  folderDefaultState: "collapsed" | "open"
  folderClickBehavior: "collapse" | "link"
  useSavedState: boolean
  sortFn: (a: FileTrieNode, b: FileTrieNode) => number
  filterFn: (node: FileTrieNode) => boolean
  mapFn: (node: FileTrieNode) => FileTrieNode
  order: OrderEntries[]
}

// --- Prepare the sortspec literal at build time ---
// This runs during build (Node). We serialize the cleaned lines into a JSON literal
// which will be embedded inside the comparator function body so the client has it.
const SORTSPEC_LITERAL = JSON.stringify(
  readSortSpecLines()
    .map(l => l.toLowerCase())
);

// Build a comparator function whose source contains the literal.
// We use new Function to ensure the function's source (and thus toString())
// contains the literal array directly; the postscript eval in the browser will
// therefore have the list available as a local const.
const comparator = new Function(
  "a",
  "b",
  `
  try {
    const sortSpecLines = ${SORTSPEC_LITERAL};

    // Browser debug: you'll see these messages in DevTools Console
    console && console.debug && console.debug("Explorer.sortFn call", {
      a: a?.displayName,
      b: b?.displayName,
      aIsFolder: a?.isFolder,
      bIsFolder: b?.isFolder,
    });

    const aName = (a?.displayName ?? "").toLowerCase();
    const bName = (b?.displayName ?? "").toLowerCase();

    const indexA = sortSpecLines.indexOf(aName);
    const indexB = sortSpecLines.indexOf(bName);

    console && console.debug && console.debug("Explorer.sortFn indices", { indexA, indexB, aName, bName });

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    // fallback: folders first, then alphabetical
    if ((a.isFolder && b.isFolder) || (!a.isFolder && !b.isFolder)) {
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }
    return a.isFolder ? -1 : 1;
  } catch (err) {
    console && console.error && console.error("Explorer.sortFn error:", err);
    if ((a.isFolder && b.isFolder) || (!a.isFolder && !b.isFolder)) {
      return a.displayName.localeCompare(b.displayName, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }
    return a.isFolder ? -1 : 1;
  }
`
) as (a: FileTrieNode, b: FileTrieNode) => number;

const defaultOptions: Options = {
  folderDefaultState: "collapsed",
  folderClickBehavior: "link",
  useSavedState: true,
  // pure map & filter so Quartz doesn't drop nodes
  mapFn: (node) => node,
  filterFn: (node) => node.slugSegment !== "tags",
  // use the comparator we built above
  sortFn: comparator,
  order: ["filter", "map", "sort"],
}

export type FolderState = {
  path: string
  collapsed: boolean
}

export default ((userOpts?: Partial<Options>) => {
  const opts: Options = { ...defaultOptions, ...userOpts }
  const { OverflowList, overflowListAfterDOMLoaded } = OverflowListFactory()

  const Explorer: QuartzComponent = ({ cfg, displayClass }: QuartzComponentProps) => {
    return (
      <div
        class={classNames(displayClass, "explorer")}
        data-behavior={opts.folderClickBehavior}
        data-collapsed={opts.folderDefaultState}
        data-savestate={opts.useSavedState}
        data-data-fns={JSON.stringify({
          order: opts.order,
          sortFn: opts.sortFn.toString(),
          filterFn: opts.filterFn.toString(),
          mapFn: opts.mapFn.toString(),
        })}
      >
        <button
          type="button"
          class="explorer-toggle mobile-explorer hide-until-loaded"
          data-mobile={true}
          aria-controls="explorer-content"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide-menu"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        <button
          type="button"
          class="title-button explorer-toggle desktop-explorer"
          data-mobile={false}
          aria-expanded={true}
        >
          <h2>{opts.title ?? i18n(cfg.locale).components.explorer.title}</h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="5 8 14 8"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="fold"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        <div class="explorer-content" aria-expanded={false}>
          <OverflowList class="explorer-ul" />
        </div>

        <template id="template-file">
          <li>
            <a href="#"></a>
          </li>
        </template>

        <template id="template-folder">
          <li>
            <div class="folder-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="5 8 14 8"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="folder-icon"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <div>
                <button class="folder-button">
                  <span class="folder-title"></span>
                </button>
              </div>
            </div>
            <div class="folder-outer">
              <ul class="content"></ul>
            </div>
          </li>
        </template>
      </div>
    )
  }

  Explorer.css = style
  Explorer.afterDOMLoaded = concatenateResources(script, overflowListAfterDOMLoaded)
  return Explorer
}) satisfies QuartzComponentConstructor
