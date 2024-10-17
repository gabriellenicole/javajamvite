import { motion } from "framer-motion";
import { Coffee, IceCream, Milk } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MenuItem = ({
	name,
	Icon,
	description,
	price,
	image,
	onChange,
}: {
	name: string;
	Icon: any;
	description: string;
	price: any;
	image: string;
	onChange: any;
}) => {
	const [quantity, setQuantity] = useState(0);
	const [size, setSize] = useState(price.single ? "single" : "endless");

	useEffect(() => {
		onChange(name, quantity, size);
	}, [quantity, size, name, onChange]);

	const calculateTotal = () => {
		if (price.single) {
			return quantity * price[size];
		} else {
			return quantity * price.endless;
		}
	};

	return (
		<Card className="w-full overflow-hidden">
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
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="double"
									id={`${name}-double`}
								/>
								<Label htmlFor={`${name}-double`}>
									Double ${price.double.toFixed(2)}
								</Label>
							</div>
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

const menuItems = [
	{
		name: "Just Java",
		Icon: Coffee,
		description:
			"Regular house blend, decaffeinated coffee, or flavor of the day.",
		price: { endless: 2.0 },
		image: "https://www.giesen.com/wp-content/uploads/2020/12/shosuke-takahashi-f6-XQoheD50-unsplash-1024x682.jpg",
	},
	{
		name: "Cafe au Lait",
		Icon: Milk,
		description:
			"House blended coffee infused into a smooth, steamed milk.",
		price: { single: 2.0, double: 3.0 },
		image: "https://www.thespruceeats.com/thmb/YEI_JAfLHd6fbfCYUukcW5E2TYg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SES-cafe-au-lait-recipe-1374920-hero-01-b1463e806a7947e7b8b17979ab70eab3.jpg",
	},
	{
		name: "Iced Cappuccino",
		Icon: IceCream,
		description: "Sweetened espresso blended with icy-cold milk.",
		price: { single: 4.75, double: 5.75 },
		image: "https://130529051.cdn6.editmysite.com/uploads/1/3/0/5/130529051/s444124611972565011_p236_i2_w1920.jpeg",
	},
];

const MenuPage = () => {
	const [order, setOrder] = useState({
		"Just Java": { quantity: 0, size: "endless" },
		"Cafe au Lait": { quantity: 0, size: "single" },
		"Iced Cappuccino": { quantity: 0, size: "single" },
	});

	const [total, setTotal] = useState(0);

	const handleItemChange = (
		name: string,
		quantity: number,
		size: "endless" | "single" | "double"
	) => {
		setOrder((prevOrder) => ({
			...prevOrder,
			[name]: { quantity, size },
		}));
	};

	useEffect(() => {
		const newTotal = Object.entries(order).reduce(
			(sum, [itemName, { quantity, size }]) => {
				const item = menuItems.find((i) => i.name === itemName);
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
	}, [order]);

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
				{menuItems.map((item) => (
					<motion.div
						key={item.name}
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
				<Button size="lg">Place Order</Button>
			</motion.div>
		</div>
	);
};

export default MenuPage;
