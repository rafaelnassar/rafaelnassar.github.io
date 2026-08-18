/**
 * APIs GET servidas como JSON estático em /api/*.json.
 * Fetch real — funciona de qualquer app, sem config.
 */

export type MockApiCategory = "people" | "commerce" | "content" | "errors";

export interface MockApiEndpoint {
  id: string;
  path: string;
  category: MockApiCategory;
  /** Agrupa cards relacionados na mesma seção visual */
  group?: string;
  title: { pt: string; en: string };
  description: { pt: string; en: string };
  tags: string[];
}

export interface MockApiGroup {
  id: string | null;
  label?: { pt: string; en: string };
  endpoints: MockApiEndpoint[];
}

export const MOCK_API_CATEGORIES: MockApiCategory[] = [
  "people",
  "commerce",
  "content",
  "errors",
];

export const categoryApiLabel: Record<
  MockApiCategory,
  { pt: string; en: string }
> = {
  people: { pt: "Pessoas", en: "People" },
  commerce: { pt: "Comércio", en: "Commerce" },
  content: { pt: "Conteúdo", en: "Content" },
  errors: { pt: "Erros", en: "Errors" },
};

export const groupApiLabel: Record<string, { pt: string; en: string }> = {
  users: { pt: "Usuários", en: "Users" },
  errors: { pt: "Erros", en: "Errors" },
};

export const mockApiEndpoints: MockApiEndpoint[] = [
  {
    id: "users-list",
    path: "/api/users.json",
    category: "people",
    group: "users",
    title: { pt: "Lista", en: "List" },
    description: {
      pt: "Nomes, e-mails, endereços e empresas fictícias.",
      en: "Names, emails, addresses and fake companies.",
    },
    tags: ["users"],
  },
  {
    id: "users-detail",
    path: "/api/users/1.json",
    category: "people",
    group: "users",
    title: { pt: "Detalhe", en: "Detail" },
    description: {
      pt: "Perfil completo — bio, redes sociais e timestamps.",
      en: "Full profile — bio, social links and timestamps.",
    },
    tags: ["users"],
  },
  {
    id: "users-empty",
    path: "/api/users-empty.json",
    category: "people",
    group: "users",
    title: { pt: "Vazio", en: "Empty" },
    description: {
      pt: "Array vazio com meta.",
      en: "Empty array with meta.",
    },
    tags: ["users"],
  },
  {
    id: "companies-list",
    path: "/api/companies.json",
    category: "people",
    title: { pt: "Empresas", en: "Companies" },
    description: {
      pt: "CNPJ, setor, funcionários e endereço.",
      en: "Tax ID, industry, employees and address.",
    },
    tags: ["companies", "b2b"],
  },
  {
    id: "products-list",
    path: "/api/products.json",
    category: "commerce",
    title: { pt: "Produtos", en: "Products" },
    description: {
      pt: "Preços em BRL, estoque, rating e categorias.",
      en: "BRL prices, stock, ratings and categories.",
    },
    tags: ["products", "e-commerce"],
  },
  {
    id: "orders-list",
    path: "/api/orders.json",
    category: "commerce",
    title: { pt: "Pedidos", en: "Orders" },
    description: {
      pt: "Itens, status (pending/shipped/delivered) e totais.",
      en: "Items, status (pending/shipped/delivered) and totals.",
    },
    tags: ["orders", "e-commerce"],
  },
  {
    id: "posts-list",
    path: "/api/posts.json",
    category: "content",
    title: { pt: "Posts", en: "Posts" },
    description: {
      pt: "Autor, categoria, tags e tempo de leitura.",
      en: "Author, category, tags and read time.",
    },
    tags: ["posts", "blog"],
  },
  {
    id: "comments-list",
    path: "/api/comments.json",
    category: "content",
    title: { pt: "Comentários", en: "Comments" },
    description: {
      pt: "Vinculados a posts, com autor e likes.",
      en: "Linked to posts, with author and likes.",
    },
    tags: ["comments", "social"],
  },
  {
    id: "todos-list",
    path: "/api/todos.json",
    category: "content",
    title: { pt: "Tarefas", en: "Todos" },
    description: {
      pt: "Prioridade, status, prazo e tags.",
      en: "Priority, status, due date and tags.",
    },
    tags: ["todos", "tasks"],
  },
  {
    id: "error-not-found",
    path: "/api/errors/not-found.json",
    category: "errors",
    group: "errors",
    title: { pt: "404", en: "404" },
    description: {
      pt: "Recurso não encontrado.",
      en: "Resource not found.",
    },
    tags: ["error"],
  },
  {
    id: "error-unauthorized",
    path: "/api/errors/unauthorized.json",
    category: "errors",
    group: "errors",
    title: { pt: "401", en: "401" },
    description: {
      pt: "Token inválido ou expirado.",
      en: "Invalid or expired token.",
    },
    tags: ["error", "auth"],
  },
  {
    id: "error-validation",
    path: "/api/errors/validation.json",
    category: "errors",
    group: "errors",
    title: { pt: "422", en: "422" },
    description: {
      pt: "Validação com erros por campo.",
      en: "Validation with per-field errors.",
    },
    tags: ["error", "validation"],
  },
];

export const getMockApisByCategory = (
  category: MockApiCategory
): MockApiEndpoint[] =>
  mockApiEndpoints.filter((endpoint) => endpoint.category === category);

export const getGroupedMockApisByCategory = (
  category: MockApiCategory
): MockApiGroup[] => {
  const groups: MockApiGroup[] = [];

  for (const endpoint of getMockApisByCategory(category)) {
    const groupId = endpoint.group ?? endpoint.id;
    const last = groups.at(-1);

    if (last?.id === groupId) {
      last.endpoints.push(endpoint);
      continue;
    }

    groups.push({
      id: endpoint.group ?? null,
      label: endpoint.group ? groupApiLabel[endpoint.group] : undefined,
      endpoints: [endpoint],
    });
  }

  return groups;
};

export const getAbsoluteApiUrl = (path: string): string => {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return path;
};
