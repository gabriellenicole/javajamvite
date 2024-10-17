import { motion } from "framer-motion";
import { Calendar, Music } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import audioSrc from "../assets/sample-audio.mp3";

const MusicEvent = ({
	month,
	artist,
	image,
	description,
}: {
	month: string;
	artist: string;
	image: string;
	description: string;
}) => (
	<Card className="mb-6 w-[800px]">
		<CardHeader>
			<CardTitle className="flex items-center gap-2 bg-neutral-100 p-2 rounded">
				<Calendar className="h-6 w-6" />
				{month}
			</CardTitle>
		</CardHeader>
		<CardContent className="flex flex-col md:flex-row gap-4">
			<div className="md:w-1/3">
				<img
					src={image}
					alt={artist}
					className="w-full h-auto rounded-lg shadow-md"
				/>
			</div>
			<div className="md:w-2/3">
				<h3 className="text-xl font-semibold mb-2">{artist}</h3>
				<p className="mb-4">{description}</p>
				<p className="font-bold mb-2">CDs are available now!</p>
				<audio controls>
					<source src={audioSrc} type="audio/mpeg" />
				</audio>
			</div>
		</CardContent>
	</Card>
);

const MusicPage = () => {
	return (
		<div className="container mx-auto px-4 py-8 mt-20">
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="text-center mb-8"
			>
				<h1 className="text-4xl font-bold mb-4">Music at JavaJam</h1>
				<p className="text-xl text-gray-600 dark:text-gray-300">
					The first Friday night each month at JavaJam is a special
					night. Join us from 8pm to 11pm for some music you don't
					want to miss!
				</p>
			</motion.div>

			<div className="flex flex-col gap-4 justify-center w-1/2 items-center mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<MusicEvent
						month="JANUARY"
						artist="Melanie Morris"
						image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStmqGramh82m3Z7SVoIfNQRZR-Vin7Is1BDA&s"
						description="Melanie Morris entertains with her melodic folk style."
					/>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<MusicEvent
						month="FEBRUARY"
						artist="Tahoe Greg"
						image="https://cdns-images.dzcdn.net/images/cover/556c12ed30efcecf16dc1b386fcc2345/1900x1900-000000-80-0-0.jpg"
						description="Tahoe Greg is back from his tour. New songs. New stories."
					/>
				</motion.div>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="mt-12"
			>
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Music className="h-6 w-6" />
							Upcoming Events
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="mb-4">
							Stay tuned for more exciting performances in the
							coming months!
						</p>
						<ul className="list-disc list-inside space-y-2">
							<li>Open Mic Nights every Wednesday</li>
							<li>
								Local Artist Showcase last Saturday of each
								month
							</li>
							<li>Annual JavaJam Music Festival in August</li>
						</ul>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
};

export default MusicPage;
