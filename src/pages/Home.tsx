import { Coffee, Music, Mic, Calendar, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({
  Icon,
  title,
  description,
}: {
  Icon: any;
  title: string;
  description: string;
}) => (
  <Card className="bg-white dark:bg-gray-800 hover:scale-105 transition-all duration-300">
    <CardContent className="p-6">
      <Icon className="h-8 w-8 mb-4 text-gray-600 dark:text-gray-300" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </CardContent>
  </Card>
);

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="container mx-auto py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Follow the Aromatic Trail to JavaJam
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Where every cup tells a story, and every visit becomes a cherished
            memory.
          </p>
          <Button
            size="lg"
            className="bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={() => navigate("/menu")}
          >
            Explore Our Menu
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            Icon={Coffee}
            title="Artisanal Brews"
            description="Savor our specialty coffees and teas, crafted with passion and expertise."
          />
          <FeatureCard
            Icon={Music}
            title="Soulful Rhythms"
            description="Immerse yourself in live music and captivating poetry readings."
          />
          <FeatureCard
            Icon={Mic}
            title="Open Mic Nights"
            description="Showcase your talent every Friday at our vibrant Open Mic events."
          />
          <FeatureCard
            Icon={Calendar}
            title="Weekly Events"
            description="Join our community for exciting events and workshops throughout the week."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col md:flex-row items-center"
        >
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              src="https://static.vecteezy.com/system/resources/previews/031/210/536/non_2x/cozy-cafe-bistro-with-blurred-background-and-wooden-montage-generative-ai-photo.jpg"
              alt="JavaJam Ambiance"
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2 md:pl-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Experience JavaJam
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Step into a world where the aroma of freshly brewed coffee mingles
              with the sounds of gentle music. Our cozy nooks and communal
              spaces are designed for both solitary reflection and lively
              conversations.
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <span>54321 Route 42, Ellison Bay, WI 54210</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-gray-500" />
                <span>888-555-8888</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HomePage;
