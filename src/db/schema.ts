import {
	boolean,
	foreignKey,
	integer,
	numeric,
	pgTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const orderDetails = pgTable(
	"order_details",
	{
		orderDetailId: serial("order_detail_id").primaryKey().notNull(),
		productId: integer("product_id"),
		quantity: integer().notNull(),
		isDouble: boolean("is_double").default(false),
		subtotal: numeric({ precision: 10, scale: 2 }).notNull(),
	},
	(table) => {
		return {
			orderDetailsProductIdProductsProductIdFk: foreignKey({
				columns: [table.productId],
				foreignColumns: [products.productId],
				name: "order_details_product_id_products_product_id_fk",
			}),
		};
	}
);

export const products = pgTable("products", {
	productId: serial("product_id").primaryKey().notNull(),
	productName: varchar("product_name", { length: 100 }).notNull(),
	description: text(),
	priceSingle: numeric("price_single", { precision: 10, scale: 2 }).notNull(),
	priceDouble: numeric("price_double", { precision: 10, scale: 2 }),
	image: varchar({ length: 255 }),
});
