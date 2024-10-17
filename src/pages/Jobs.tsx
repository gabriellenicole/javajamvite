import { motion } from "framer-motion";
import { Coffee, Send } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const JobsPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		startDate: "",
		experience: "",
	});

	const [errors, setErrors] = useState({});
	const { toast } = useToast();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		validateField(name, value);
	};

	const validateField = (name: string, value: string) => {
		let error = "";
		const today = new Date();
		const selectedDate = new Date(value);
		switch (name) {
			case "name":
				if (!/^[A-Za-z\s]+$/.test(value)) {
					error = "Name should only contain alphabets and spaces.";
				}
				break;
			case "email":
				if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,4}$/.test(value)) {
					error = "Please enter a valid email address.";
				}
				break;
			case "startDate":
				if (selectedDate <= today) {
					error = "Start date must be in the future.";
				}
				break;
			default:
				break;
		}
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: error,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formErrors = Object.values(errors).filter(
			(error) => error !== ""
		);
		if (formData.name === "" && formData.email === "") {
			toast({
				title: "Error",
				description: "Please enter your name and email.",
				variant: "destructive",
			});
			return;
		}
		if (formData.name === "") {
			toast({
				title: "Error",
				description: "Please enter your name.",
				variant: "destructive",
			});
			return;
		}
		if (formData.email === "") {
			toast({
				title: "Error",
				description: "Please enter your email.",
				variant: "destructive",
			});
			return;
		}
		if (formErrors.length === 0) {
			// Here you would typically send the form data to a server
			console.log("Form submitted:", formData);
			toast({
				title: "Application Submitted",
				description:
					"Thank you for your interest in JavaJam Coffee House!",
			});
			handleClear();
		} else {
			toast({
				title: "Form Error",
				description: "Please correct the errors in the form.",
				variant: "destructive",
			});
		}
	};

	const handleClear = () => {
		setFormData({
			name: "",
			email: "",
			startDate: "",
			experience: "",
		});
		setErrors({});
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center mb-8"
			>
				<h1 className="text-4xl font-bold mb-4">Jobs at JavaJam</h1>
				<p className="text-xl text-gray-600 dark:text-gray-300">
					Join our team and be part of the JavaJam experience!
				</p>
			</motion.div>

			<Card className="max-w-2xl mx-auto">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Coffee className="h-6 w-6" />
						Job Application Form
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="name">Name *</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleChange}
								placeholder="Enter your name"
								required
							/>
							{errors.name && (
								<p className="text-sm text-red-500">
									{errors.name}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								name="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter your email"
								required
							/>
							{errors.email && (
								<p className="text-sm text-red-500">
									{errors.email}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="startDate">Start Date</Label>
							<Input
								id="startDate"
								name="startDate"
								type="date"
								value={formData.startDate}
								onChange={handleChange}
							/>
							{errors.startDate && (
								<p className="text-sm text-red-500">
									{errors.startDate}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<Label htmlFor="experience">Experience</Label>
							<Textarea
								id="experience"
								name="experience"
								value={formData.experience}
								onChange={handleChange}
								placeholder="Tell us about your past experience"
								required
							/>
						</div>

						<div className="flex justify-between">
							<Button type="reset" variant="outline">
								Clear
							</Button>
							<Button type="submit" onClick={handleSubmit}>
								<Send className="mr-2 h-4 w-4" /> Apply Now
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default JobsPage;
