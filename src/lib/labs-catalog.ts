export const TOOLS_LIST_PATH = "/labs/ferramentas";

const TOOLS_LIST_HREF_KEY = "labs:ferramentas:href";

export const buildToolsListHref = (
  search: string | URLSearchParams = ""
): string => {
  const query =
    typeof search === "string" ? search.replace(/^\?/, "") : search.toString();
  return query ? `${TOOLS_LIST_PATH}?${query}` : TOOLS_LIST_PATH;
};

export const saveToolsListHref = (href: string) => {
  try {
    sessionStorage.setItem(TOOLS_LIST_HREF_KEY, href);
  } catch {
    /* private mode / blocked storage */
  }
};

export const readToolsListHref = (): string => {
  try {
    return sessionStorage.getItem(TOOLS_LIST_HREF_KEY) || TOOLS_LIST_PATH;
  } catch {
    return TOOLS_LIST_PATH;
  }
};

export const isToolsDetailPath = (pathname: string): boolean =>
  /^\/labs\/ferramentas\/[^/]+/.test(pathname);
