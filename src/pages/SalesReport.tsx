import { eq, sql } from "drizzle-orm";
import { useEffect, useState } from "react";

import { db } from "@/db";
import { orderDetails, products } from "@/db/schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const SalesReportPage = () => {
	const [salesData, setSalesData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchSalesData();
	}, []);

	const fetchSalesData = async () => {
		try {
			// Fetch sales by products
			const productSales = await db
				.select({
					productName: products.productName,
					singleShotQty: sql`SUM(CASE WHEN ${orderDetails.isDouble} = false THEN ${orderDetails.quantity} ELSE 0 END)`,
					singleShotSales: sql`SUM(CASE WHEN ${orderDetails.isDouble} = false THEN ${orderDetails.subtotal} ELSE 0 END)`,
					doubleShotQty: sql`SUM(CASE WHEN ${orderDetails.isDouble} = true THEN ${orderDetails.quantity} ELSE 0 END)`,
					doubleShotSales: sql`SUM(CASE WHEN ${orderDetails.isDouble} = true THEN ${orderDetails.subtotal} ELSE 0 END)`,
				})
				.from(products)
				.leftJoin(
					orderDetails,
					eq(products.productId, orderDetails.productId)
				)
				.groupBy(products.productId, products.productName);

			// Fetch sales by categories
			const categorySales = await db
				.select({
					isDouble: orderDetails.isDouble,
					quantity: sql`SUM(${orderDetails.quantity})`,
					sales: sql`SUM(${orderDetails.subtotal})`,
				})
				.from(orderDetails)
				.groupBy(orderDetails.isDouble);

			console.log(JSON.stringify(categorySales, null, 2));

			// Fetch most popular product
			const popularProduct = await db
				.select({
					productName: products.productName,
					quantity: sql`SUM(${orderDetails.quantity})`,
					isDouble: orderDetails.isDouble,
				})
				.from(products)
				.leftJoin(
					orderDetails,
					eq(products.productId, orderDetails.productId)
				)
				.groupBy(
					products.productId,
					products.productName,
					orderDetails.isDouble
				)
				.orderBy(sql`SUM(${orderDetails.quantity}) DESC`)
				.limit(1);

			setSalesData({
				productSales,
				categorySales,
				popularProduct: popularProduct[0],
			});
			setLoading(false);
		} catch (error) {
			console.error("Error fetching sales data:", error);
			setLoading(false);
		}
	};

	if (loading) {
		return <div className="text-center">Loading...</div>;
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-3xl font-bold mb-6">Sales Report</h1>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Sales by Products</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Product</TableHead>
								<TableHead>Single Shot Qty</TableHead>
								<TableHead>Single Shot Sales</TableHead>
								<TableHead>Double Shot Qty</TableHead>
								<TableHead>Double Shot Sales</TableHead>
								<TableHead>Total Qty</TableHead>
								<TableHead>Total Sales</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{salesData.productSales.map((product) => (
								<TableRow key={product.productName}>
									<TableCell>{product.productName}</TableCell>
									<TableCell>
										{product.singleShotQty}
									</TableCell>
									<TableCell>
										${product.singleShotSales || "0.00"}
									</TableCell>
									<TableCell>
										{product.doubleShotQty}
									</TableCell>
									<TableCell>
										${product.doubleShotSales || "0.00"}
									</TableCell>
									<TableCell>
										{Number(product.singleShotQty) +
											Number(product.doubleShotQty)}
									</TableCell>
									<TableCell>
										$
										{(
											Number(product.singleShotSales) +
											Number(product.doubleShotSales)
										).toFixed(2)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Card className="mb-6">
				<CardHeader>
					<CardTitle>Sales by Categories</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Category</TableHead>
								<TableHead>Quantity</TableHead>
								<TableHead>Sales</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{salesData.categorySales.map((category) => (
								<TableRow
									key={
										category.isDouble
											? "Double Shot"
											: "Single Shot"
									}
								>
									<TableCell>
										{category.isDouble
											? "Double Shot"
											: "Single Shot"}
									</TableCell>
									<TableCell>{category.quantity}</TableCell>
									<TableCell>
										${Number(category.sales).toFixed(2)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Most Popular Product</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{salesData.popularProduct.productName}</p>
					<p>Total Quantity: {salesData.popularProduct.quantity}</p>
					<p>
						Shot Type:{" "}
						{salesData.popularProduct.isDouble
							? "Double Shot"
							: "Single Shot"}
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default SalesReportPage;
