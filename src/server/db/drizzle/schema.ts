// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, sqliteTableCreator } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `gallery-aws_${name}`);

export const images = createTable(
  "image",
  (d) => ({
    id: d.text().primaryKey(), // Use nanoid/cuid for IDs
    key: d.text().notNull().unique(),
    url: d.text().notNull().unique(),
    filename: d.text().notNull(),
    uploadedAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    userID: d.text(),
  }),
  (t) => [index("key_idx").on(t.key)],
);
