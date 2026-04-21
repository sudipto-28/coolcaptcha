import { randomUUID } from "node:crypto";

import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleEnum = pgEnum("UserRole", ["ADMIN"]);

export const articleStatusEnum = pgEnum("ArticleStatus", [
  "DRAFT",
  "REVIEW",
  "PUBLISHED",
  "ARCHIVED",
]);

export const importStatusEnum = pgEnum("ImportStatus", [
  "FETCHED",
  "FILTERED",
  "SKIPPED",
  "PROCESSED",
  "FAILED",
]);

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

const createdAt = () =>
  timestamp("createdAt", { mode: "date" }).notNull().defaultNow();

const updatedAt = () =>
  timestamp("updatedAt", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date());

export const usersTable = pgTable(
  "User",
  {
    id: id(),
    name: text("name"),
    email: text("email").notNull().unique(),
    passwordHash: text("passwordHash").notNull(),
    role: userRoleEnum("role").notNull().default("ADMIN"),
    isActive: boolean("isActive").notNull().default(true),
    lastLoginAt: timestamp("lastLoginAt", { mode: "date" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("User_email_idx").on(table.email)],
);

export const sourcesTable = pgTable(
  "Source",
  {
    id: id(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    rssUrl: text("rssUrl").notNull().unique(),
    websiteUrl: text("websiteUrl"),
    isActive: boolean("isActive").notNull().default(true),
    fetchInterval: integer("fetchInterval").notNull().default(20),
    lastFetchedAt: timestamp("lastFetchedAt", { mode: "date" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("Source_isActive_idx").on(table.isActive),
    index("Source_name_idx").on(table.name),
  ],
);

export const categoriesTable = pgTable(
  "Category",
  {
    id: id(),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    isFilterable: boolean("isFilterable").notNull().default(true),
  },
  (table) => [
    index("Category_name_idx").on(table.name),
    index("Category_isFilterable_idx").on(table.isFilterable),
  ],
);

export const articlesTable = pgTable(
  "Article",
  {
    id: id(),
    authorId: text("authorId")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    sourceId: text("sourceId").references(() => sourcesTable.id, {
      onDelete: "set null",
    }),
    categoryId: text("categoryId").references(() => categoriesTable.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    summaryPoints: jsonb("summaryPoints").$type<string[]>(),
    sourceUrl: text("sourceUrl"),
    sourceName: text("sourceName"),
    aiSummary: text("aiSummary"),
    featuredImage: text("featuredImage"),
    status: articleStatusEnum("status").notNull().default("DRAFT"),
    isFeatured: boolean("isFeatured").notNull().default(false),
    publishedAt: timestamp("publishedAt", { mode: "date" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("Article_authorId_idx").on(table.authorId),
    index("Article_sourceId_idx").on(table.sourceId),
    index("Article_categoryId_idx").on(table.categoryId),
    index("Article_status_idx").on(table.status),
    index("Article_publishedAt_idx").on(table.publishedAt),
    index("Article_isFeatured_idx").on(table.isFeatured),
  ],
);

export const articleImportsTable = pgTable(
  "ArticleImport",
  {
    id: id(),
    sourceId: text("sourceId")
      .notNull()
      .references(() => sourcesTable.id, { onDelete: "cascade" }),
    externalId: text("externalId").notNull().unique(),
    originalUrl: text("originalUrl").notNull(),
    publishedAt: timestamp("publishedAt", { mode: "date" }),
    fetchedAt: timestamp("fetchedAt", { mode: "date" }).notNull().defaultNow(),
    status: importStatusEnum("status").notNull().default("FETCHED"),
    errorMessage: text("errorMessage"),
    articleId: text("articleId").unique().references(() => articlesTable.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    index("ArticleImport_sourceId_idx").on(table.sourceId),
    index("ArticleImport_originalUrl_idx").on(table.originalUrl),
    index("ArticleImport_publishedAt_idx").on(table.publishedAt),
    index("ArticleImport_status_idx").on(table.status),
  ],
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  articles: many(articlesTable),
}));

export const sourcesRelations = relations(sourcesTable, ({ many }) => ({
  imports: many(articleImportsTable),
  articles: many(articlesTable),
}));

export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  articles: many(articlesTable),
}));

export const articlesRelations = relations(articlesTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [articlesTable.authorId],
    references: [usersTable.id],
  }),
  source: one(sourcesTable, {
    fields: [articlesTable.sourceId],
    references: [sourcesTable.id],
  }),
  category: one(categoriesTable, {
    fields: [articlesTable.categoryId],
    references: [categoriesTable.id],
  }),
  articleImport: one(articleImportsTable),
}));

export const articleImportsRelations = relations(
  articleImportsTable,
  ({ one }) => ({
    source: one(sourcesTable, {
      fields: [articleImportsTable.sourceId],
      references: [sourcesTable.id],
    }),
    article: one(articlesTable, {
      fields: [articleImportsTable.articleId],
      references: [articlesTable.id],
    }),
  }),
);

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertSourceSchema = createInsertSchema(sourcesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertCategorySchema = createInsertSchema(categoriesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertArticleSchema = createInsertSchema(articlesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertArticleImportSchema = createInsertSchema(
  articleImportsTable,
).omit({
  id: true,
  fetchedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

export type InsertSource = z.infer<typeof insertSourceSchema>;
export type Source = typeof sourcesTable.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categoriesTable.$inferSelect;

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articlesTable.$inferSelect;

export type InsertArticleImport = z.infer<typeof insertArticleImportSchema>;
export type ArticleImport = typeof articleImportsTable.$inferSelect;
