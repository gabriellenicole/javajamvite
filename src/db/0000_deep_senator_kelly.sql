-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "order_details" (
	"order_detail_id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"quantity" integer NOT NULL,
	"is_double" boolean DEFAULT false,
	"subtotal" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"product_name" varchar(100) NOT NULL,
	"description" text,
	"price_single" numeric(10, 2) NOT NULL,
	"price_double" numeric(10, 2),
	"image" varchar(255)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_details" ADD CONSTRAINT "order_details_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

*/