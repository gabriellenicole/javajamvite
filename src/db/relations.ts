import { relations } from "drizzle-orm/relations";

import { orderDetails, products } from "./schema";

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
	product: one(products, {
		fields: [orderDetails.productId],
		references: [products.productId],
	}),
}));

export const productsRelations = relations(products, ({ many }) => ({
	orderDetails: many(orderDetails),
}));
