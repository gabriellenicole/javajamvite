import { motion } from "framer-motion";
import { Coffee, IceCream, Milk } from "lucide-react";
import { useEffect, useState } from "react";

// Import the necessary Drizzle functions
import { db } from "@/db";
import { orderDetails, products } from "@/db/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define the Product type based on your schema
type Product = {
	id: number;
	name: string;
	icon: string;
	description: string;
	price: {
		single?: number;
		double?: number;
		endless?: number;
	};
	image: string;
};

// Server action to fetch products
async function getProducts() {
	return await db.select().from(products);
}

async function placeOrder(
	orderItems: Array<{
		productId: number;
		quantity: number;
		isDouble: boolean;
		subtotal: number;
	}>
) {
	const validOrderItems = orderItems.filter((item) => item.quantity > 0);

	const insertPromises = validOrderItems.map((item) =>
		// @ts-expect-error ORM
		db.insert(orderDetails).values({
			productId: item.productId,
			quantity: item.quantity,
			isDouble: item.isDouble,
			subtotal: item.subtotal,
		})
	);

	await Promise.all(insertPromises);
}

const MenuItem = ({
	id,
	name,
	icon,
	description,
	price,
	image,
	onChange,
}: Product & { onChange: any }) => {
	const [quantity, setQuantity] = useState(0);
	const [size, setSize] = useState(price.single ? "single" : "endless");

	useEffect(() => {
		onChange(id, name, quantity, size);
	}, [quantity, size, id, name, onChange]);

	const calculateTotal = () => {
		if (price.single) {
			return quantity * (price[size as keyof typeof price] || 0);
		} else {
			return quantity * (price.endless || 0);
		}
	};

	const Icon = icon === "Coffee" ? Coffee : icon === "Milk" ? Milk : IceCream;

	return (
		<Card className="w-full h-full overflow-hidden flex flex-col justify-between">
			<div className="relative h-48 overflow-hidden">
				<img
					src={image}
					alt={name}
					className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
				<CardTitle className="absolute bottom-2 left-2 text-white flex items-center gap-2">
					<Icon className="h-6 w-6" />
					{name}
				</CardTitle>
			</div>
			<CardContent className="pt-4 flex flex-col justify-between flex-1">
				<div>
					<p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
						{description}
					</p>
					{price.single && (
						<RadioGroup
							defaultValue={size}
							onValueChange={setSize}
							className="flex space-x-4 mb-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="single"
									id={`${name}-single`}
								/>
								<Label htmlFor={`${name}-single`}>
									Single ${price.single.toFixed(2)}
								</Label>
							</div>
							{price.double ? (
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="double"
										id={`${name}-double`}
									/>
									<Label htmlFor={`${name}-double`}>
										Double ${price.double.toFixed(2)}
									</Label>
								</div>
							) : null}
						</RadioGroup>
					)}
					{!price.single && (
						<p className="mb-4">
							Endless Cup ${price.endless.toFixed(2)}
						</p>
					)}
				</div>
				<div className="flex items-center space-x-2 justify-between mt-10">
					<div className="flex items-center space-x-2">
						<Label htmlFor={`${name}-quantity`}>Quantity:</Label>
						<Input
							type="number"
							id={`${name}-quantity`}
							value={quantity}
							onChange={(e) =>
								setQuantity(parseInt(e.target.value) || 0)
							}
							min="0"
							className="w-20"
						/>
					</div>
					<div>
						<p>Total: ${calculateTotal().toFixed(2)}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const MenuPage = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [order, setOrder] = useState<
		Record<number, { name: string; quantity: number; size: string }>
	>({});
	const [total, setTotal] = useState(0);
	const [isPlacingOrder, setIsPlacingOrder] = useState(false);

	useEffect(() => {
		async function fetchProducts() {
			const fetchedProducts = await getProducts();
			const mappedProducts = fetchedProducts.map((product) => ({
				id: product.productId,
				name: product.productName,
				icon: "Coffee", // or any default icon, you can adjust this as needed
				description: product.description,
				price: {
					single: parseFloat(product.priceSingle),
					double: parseFloat(product.priceDouble),
					endless: undefined, // or any default value if needed
				},
				image: product.image,
			}));
			setProducts(mappedProducts);
		}
		fetchProducts();
	}, []);

	const handleItemChange = (
		id: number,
		name: string,
		quantity: number,
		size: "endless" | "single" | "double"
	) => {
		setOrder((prevOrder) => ({
			...prevOrder,
			[id]: { name, quantity, size },
		}));
	};

	useEffect(() => {
		const newTotal = Object.entries(order).reduce(
			(sum, [id, { quantity, size }]) => {
				const item = products.find((p) => p.id === Number(id));
				if (!item) return sum;

				const price =
					size in item.price
						? item.price[size as keyof typeof item.price]
						: item.price.endless;

				return sum + (price || 0) * quantity;
			},
			0
		);
		setTotal(newTotal);
	}, [order, products]);

	const handlePlaceOrder = async () => {
		setIsPlacingOrder(true);
		try {
			const orderItems = Object.entries(order).map(
				([productId, details]) => {
					const product = products.find(
						(p) => p.id === Number(productId)
					);
					if (!product)
						throw new Error(`Product not found: ${productId}`);

					const price =
						details.size === "double"
							? product.price.double
							: product.price.single;
					if (!price)
						throw new Error(
							`Invalid price for product: ${productId}`
						);

					return {
						productId: Number(productId),
						quantity: details.quantity,
						isDouble: details.size === "double",
						subtotal: price * details.quantity,
					};
				}
			);

			await placeOrder(orderItems);

			// Clear the order after successful placement
			setOrder({});
			setTotal(0);
			alert("Order placed successfully!");
		} catch (error) {
			console.error("Error placing order:", error);
			alert("Failed to place order. Please try again.");
		} finally {
			setIsPlacingOrder(false);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-4xl font-bold mb-8 text-center"
			>
				Coffee at JavaJam
			</motion.h1>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
				{products.map((item) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
					>
						<MenuItem {...item} onChange={handleItemChange} />
					</motion.div>
				))}
			</div>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-right"
			>
				<p className="text-xl font-semibold mb-4">
					Total: ${total.toFixed(2)}
				</p>
				<Button
					size="lg"
					onClick={handlePlaceOrder}
					disabled={isPlacingOrder || total === 0}
				>
					{isPlacingOrder ? "Placing Order..." : "Place Order"}
				</Button>
			</motion.div>
		</div>
	);
};

export default MenuPage;
