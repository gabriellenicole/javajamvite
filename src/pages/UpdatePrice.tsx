import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";

import { db } from "@/db";
import { products } from "@/db/schema";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const UpdatePricesPage = () => {
	const [productsData, setProductsData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const fetchedProducts = await db.select().from(products);
			setProductsData(fetchedProducts);
			setLoading(false);
		} catch (error) {
			console.error("Error fetching products:", error);
			toast({
				title: "Error",
				description: "Failed to fetch products. Please try again.",
				variant: "destructive",
			});
			setLoading(false);
		}
	};

	const handlePriceChange = (id, field, value) => {
		setProductsData(
			productsData.map((product) =>
				product.productId === id
					? { ...product, [field]: value }
					: product
			)
		);
	};

	const handleSubmit = async () => {
		if (
			productsData.some(
				(product) =>
					product.priceSingle <= 0 || product.priceDouble <= 0
			)
		) {
			toast({
				title: "Error",
				description: "Price should be greater than 0.",
				variant: "destructive",
			});
			return;
		}
		try {
			for (const product of productsData) {
				await db
					.update(products)
					.set({
						priceSingle: product.priceSingle,
						priceDouble: product.priceDouble,
					})
					.where(eq(products.productId, product.productId));
			}
			toast({
				title: "Success",
				description: "Product prices updated successfully.",
			});
		} catch (error) {
			console.error("Error updating prices:", error);
			toast({
				title: "Error",
				description: "Failed to update prices. Please try again.",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return <div className="text-center">Loading...</div>;
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-3xl font-bold mb-6">Update Product Prices</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Product Name</TableHead>
						<TableHead>Single Price</TableHead>
						<TableHead>Double Price</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{productsData.map((product) => (
						<TableRow key={product.productId}>
							<TableCell>{product.productName}</TableCell>
							<TableCell>
								<Input
									type="number"
									value={product.priceSingle}
									onChange={(e) =>
										handlePriceChange(
											product.productId,
											"priceSingle",
											e.target.value
										)
									}
									step="0.01"
									min="0"
								/>
							</TableCell>
							<TableCell>
								<Input
									type="number"
									value={product.priceDouble || ""}
									onChange={(e) =>
										handlePriceChange(
											product.productId,
											"priceDouble",
											e.target.value
										)
									}
									step="0.01"
									min="0"
									disabled={!product.priceDouble}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="mt-6 flex justify-end w-100">
				<Button onClick={handleSubmit}>Update Prices</Button>
			</div>
		</div>
	);
};

export default UpdatePricesPage;
