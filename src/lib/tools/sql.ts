export type SqlFormatResult =
  | { status: "idle" }
  | { status: "valid"; output: string }
  | { status: "invalid"; error: string };

type Kind = "word" | "string" | "number" | "punct" | "comment";

interface Token {
  kind: Kind;
  value: string;
}

const CLAUSES = [
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "FULL OUTER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "INNER JOIN",
  "OUTER JOIN",
  "CROSS JOIN",
  "GROUP BY",
  "ORDER BY",
  "INSERT INTO",
  "DELETE FROM",
  "UNION ALL",
  "SELECT DISTINCT",
  "CREATE TABLE",
  "ALTER TABLE",
  "DROP TABLE",
  "SELECT",
  "FROM",
  "WHERE",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "VALUES",
  "UPDATE",
  "SET",
  "JOIN",
  "UNION",
  "WITH",
  "RETURNING",
] as const;

const KEYWORDS = new Set(
  [
    ...CLAUSES.flatMap((clause) => clause.split(" ")),
    "AND",
    "OR",
    "NOT",
    "NULL",
    "TRUE",
    "FALSE",
    "AS",
    "ON",
    "IN",
    "IS",
    "LIKE",
    "BETWEEN",
    "EXISTS",
    "CASE",
    "WHEN",
    "THEN",
    "ELSE",
    "END",
    "ASC",
    "DESC",
    "DISTINCT",
    "INTO",
    "TABLE",
    "CREATE",
    "ALTER",
    "DROP",
    "PRIMARY",
    "KEY",
    "FOREIGN",
    "REFERENCES",
    "DEFAULT",
    "UNIQUE",
    "CONSTRAINT",
    "INDEX",
    "INSERT",
    "DELETE",
    "REPLACE",
    "OVER",
    "PARTITION",
    "ROWS",
    "UNBOUNDED",
    "PRECEDING",
    "FOLLOWING",
    "CURRENT",
    "ROW",
    "IF",
    "BEGIN",
    "COMMIT",
    "ROLLBACK",
    "COUNT",
    "SUM",
    "AVG",
    "MIN",
    "MAX",
    "COALESCE",
    "NULLIF",
    "CAST",
    "CONVERT",
    "SUBSTRING",
    "TRIM",
    "LOWER",
    "UPPER",
    "LENGTH",
    "NOW",
  ].map((word) => word.toUpperCase())
);

const LINE_BREAK_WORDS = new Set(["AND", "OR", "ON", "WHEN", "ELSE"]);
const TWO_CHAR_PUNCT = new Set(["<=", ">=", "<>", "!=", "||", "::"]);
const NO_SPACE_AFTER = new Set(["(", "[", ".", "::"]);
const NO_SPACE_BEFORE = new Set([",", ";", ")", "]", ".", "::"]);
const SPACE_BEFORE_PAREN = new Set([
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "ON",
  "AND",
  "OR",
  "IN",
  "VALUES",
  "SET",
  "EXISTS",
  "NOT",
  "AS",
  "BY",
  "TABLE",
  "INTO",
  "UPDATE",
  "IF",
  "WHEN",
  "THEN",
  "ELSE",
  "RETURNING",
  "HAVING",
]);

const isWordStart = (ch: string) => /[A-Za-z_]/.test(ch);
const isWordChar = (ch: string) => /[A-Za-z0-9_]/.test(ch);

const needsSpace = (prev: string, next: string) => {
  if (!prev) return false;
  if (next === "(") return SPACE_BEFORE_PAREN.has(prev);
  if (NO_SPACE_AFTER.has(prev)) return false;
  if (NO_SPACE_BEFORE.has(next)) return false;
  return true;
};

const listWillBreak = (tokens: Token[], openIndex: number) => {
  let depth = 1;
  for (let i = openIndex + 1; i < tokens.length && depth > 0; i += 1) {
    const token = tokens[i];
    if (token.kind !== "punct") continue;
    if (token.value === "(") depth += 1;
    else if (token.value === ")") depth -= 1;
    else if (token.value === "," && depth === 1) return true;
  }
  return false;
};

const tokenizeSql = (input: string): { tokens: Token[]; error?: string } => {
  const tokens: Token[] = [];
  let i = 0;
  const n = input.length;
  const peek = (offset = 0) => input[i + offset] ?? "";

  while (i < n) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    if (ch === "-" && peek(1) === "-") {
      const start = i;
      i += 2;
      while (i < n && input[i] !== "\n") i += 1;
      tokens.push({ kind: "comment", value: input.slice(start, i).trimEnd() });
      continue;
    }

    if (ch === "/" && peek(1) === "*") {
      const start = i;
      i += 2;
      while (i < n && !(input[i] === "*" && peek(1) === "/")) i += 1;
      if (i >= n) return { tokens, error: "Unclosed block comment." };
      i += 2;
      tokens.push({ kind: "comment", value: input.slice(start, i) });
      continue;
    }

    if (ch === "'" || ch === '"' || ch === "`") {
      const quote = ch;
      let value = ch;
      i += 1;
      let closed = false;
      while (i < n) {
        const current = input[i];
        value += current;
        i += 1;
        if (current === quote) {
          if (peek() === quote) {
            value += quote;
            i += 1;
            continue;
          }
          closed = true;
          break;
        }
      }
      if (!closed) return { tokens, error: "Unclosed string." };
      tokens.push({ kind: "string", value });
      continue;
    }

    if (ch === "[") {
      const start = i;
      i += 1;
      while (i < n && input[i] !== "]") i += 1;
      if (i >= n) return { tokens, error: "Unclosed identifier." };
      i += 1;
      tokens.push({ kind: "string", value: input.slice(start, i) });
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(peek(1)))) {
      const start = i;
      i += 1;
      while (i < n && /[0-9.]/.test(input[i])) i += 1;
      tokens.push({ kind: "number", value: input.slice(start, i) });
      continue;
    }

    if (isWordStart(ch)) {
      const start = i;
      i += 1;
      while (i < n && isWordChar(input[i])) i += 1;
      tokens.push({ kind: "word", value: input.slice(start, i) });
      continue;
    }

    const two = ch + peek(1);
    if (TWO_CHAR_PUNCT.has(two)) {
      tokens.push({ kind: "punct", value: two });
      i += 2;
      continue;
    }

    tokens.push({ kind: "punct", value: ch });
    i += 1;
  }

  return { tokens };
};

const matchClause = (
  tokens: Token[],
  index: number
): { value: string; count: number } | null => {
  for (const clause of CLAUSES) {
    const parts = clause.split(" ");
    if (index + parts.length > tokens.length) continue;
    const matches = parts.every((part, offset) => {
      const token = tokens[index + offset];
      return token.kind === "word" && token.value.toUpperCase() === part;
    });
    if (matches) return { value: clause, count: parts.length };
  }
  return null;
};

const parenBalanceError = (tokens: Token[]): string | undefined => {
  let depth = 0;
  for (const token of tokens) {
    if (token.kind !== "punct") continue;
    if (token.value === "(") depth += 1;
    if (token.value === ")") depth -= 1;
    if (depth < 0) return "Unmatched ')'.";
  }
  if (depth > 0) return "Unclosed '('.";
  return undefined;
};

const wordText = (value: string) => {
  const upper = value.toUpperCase();
  return KEYWORDS.has(upper) ? upper : value;
};

const formatTokens = (tokens: Token[], pretty: boolean): string => {
  let out = "";
  let last = "";
  let lastClause = "";
  let i = 0;
  let depth = 0;
  let pendingBreak = false;
  let pendingIndent = 0;
  let lineIndent = 0;
  const parenStack: Array<{ broke: boolean; closeIndent: number }> = [];
  const tableListClauses = new Set([
    "INSERT INTO",
    "CREATE TABLE",
    "ALTER TABLE",
    "UPDATE",
    "FROM",
    "JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "INNER JOIN",
    "OUTER JOIN",
    "CROSS JOIN",
    "LEFT OUTER JOIN",
    "RIGHT OUTER JOIN",
    "FULL OUTER JOIN",
  ]);

  const contentIndent = () => {
    const frame = parenStack[parenStack.length - 1];
    return frame ? frame.closeIndent + 1 : depth + 1;
  };

  const markParenBroke = () => {
    const frame = parenStack[parenStack.length - 1];
    if (frame) frame.broke = true;
  };

  const requestBreak = (indent: number) => {
    pendingBreak = true;
    pendingIndent = indent;
  };

  const gap = (prev: string, next: string) => {
    if (!prev) return false;
    if (next === "(") {
      if (SPACE_BEFORE_PAREN.has(prev)) return true;
      return Boolean(
        lastClause && tableListClauses.has(lastClause) && !KEYWORDS.has(prev)
      );
    }
    return needsSpace(prev, next);
  };

  const emit = (text: string) => {
    if (pretty && pendingBreak && out) {
      lineIndent = Math.max(0, pendingIndent);
      out += `\n${"  ".repeat(lineIndent)}`;
      out += text;
    } else {
      if (out && gap(last, text)) out += " ";
      out += text;
    }
    pendingBreak = false;
    last = text;
  };

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.kind === "comment") {
      if (pretty) requestBreak(depth);
      emit(token.value);
      if (pretty) requestBreak(contentIndent());
      i += 1;
      continue;
    }

    const clause = matchClause(tokens, i);
    if (clause) {
      lastClause = clause.value;
      if (pretty) {
        requestBreak(depth);
        markParenBroke();
      }
      emit(clause.value);
      if (pretty) requestBreak(contentIndent());
      i += clause.count;
      continue;
    }

    if (token.kind === "word") {
      const text = wordText(token.value);
      if (pretty && LINE_BREAK_WORDS.has(text)) {
        requestBreak(contentIndent());
        markParenBroke();
      }
      emit(text);
      i += 1;
      continue;
    }

    if (token.kind === "punct") {
      if (token.value === "(") {
        const closeIndent =
          pretty && pendingBreak && out ? pendingIndent : lineIndent;
        const willBreak = pretty && listWillBreak(tokens, i);
        emit("(");
        depth += 1;
        parenStack.push({ broke: willBreak, closeIndent });
        if (willBreak) requestBreak(closeIndent + 1);
        i += 1;
        continue;
      }

      if (token.value === ")") {
        depth = Math.max(0, depth - 1);
        const frame = parenStack.pop();
        if (pretty && frame?.broke) requestBreak(frame.closeIndent);
        emit(")");
        i += 1;
        continue;
      }

      if (token.value === ",") {
        emit(",");
        if (pretty) {
          requestBreak(contentIndent());
          markParenBroke();
        }
        i += 1;
        continue;
      }

      emit(token.value);
      i += 1;
      continue;
    }

    emit(token.value);
    i += 1;
  }

  return out.trim();
};

export const formatSql = (input: string, pretty: boolean): SqlFormatResult => {
  const trimmed = input.trim();
  if (!trimmed) return { status: "idle" };

  const scanned = tokenizeSql(trimmed);
  if (scanned.error) return { status: "invalid", error: scanned.error };

  const balanceError = parenBalanceError(scanned.tokens);
  if (balanceError) return { status: "invalid", error: balanceError };

  return { status: "valid", output: formatTokens(scanned.tokens, pretty) };
};
