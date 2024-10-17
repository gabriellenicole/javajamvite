import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	pgTable,
	serial,
	text,
	varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
	productId: serial("product_id").primaryKey(),
	productName: varchar("product_name", { length: 100 }).notNull(),
	description: text("description"),
	priceSingle: decimal("price_single", { precision: 10, scale: 2 }).notNull(),
	priceDouble: decimal("price_double", { precision: 10, scale: 2 }),
});

export const orderDetails = pgTable("order_details", {
	orderDetailId: serial("order_detail_id").primaryKey(),
	productId: integer("product_id").references(() => products.productId),
	quantity: integer("quantity").notNull(),
	isDouble: boolean("is_double").default(false),
	subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
	orderDetails: many(orderDetails),
}));

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
	product: one(products, {
		fields: [orderDetails.productId],
		references: [products.productId],
	}),
}));
