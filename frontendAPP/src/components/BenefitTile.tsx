import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface BenefitTileProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const BenefitTile = ({ Icon, title, description, delay }: BenefitTileProps) => {
  return (
    <motion.div
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
      transition={{ delay }}
      className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-cyber-purple/20 transition-all"
    >
      <Icon className="w-12 h-12 text-cyber-purple mb-6" />
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-holo-white/70 text-lg">{description}</p>
    </motion.div>
  );
};

export default BenefitTile; 