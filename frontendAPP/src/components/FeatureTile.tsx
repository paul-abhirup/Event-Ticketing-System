import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureTileProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const FeatureTile = ({ Icon, title, description, delay }: FeatureTileProps) => {
  return (
    <motion.div
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
      transition={{ delay }}
      className="bg-background/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-cyber-purple/20 hover:border-cyber-purple/40 transition-all"
    >
      <Icon className="w-12 h-12 text-cyber-purple mb-4" />
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-holo-white/70">{description}</p>
    </motion.div>
  );
};

export default FeatureTile; 