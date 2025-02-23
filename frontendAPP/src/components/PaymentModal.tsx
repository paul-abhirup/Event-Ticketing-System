import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, QrCode, Bank, ChevronRight } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  ticketId: number;
}

type PaymentMethod = 'crypto' | 'card' | 'qr' | 'bank';

const PaymentModal = ({ isOpen, onClose, amount, ticketId }: PaymentModalProps) => {
  const [step, setStep] = useState<'method' | 'details'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const paymentMethods = [
    {
      id: 'crypto' as PaymentMethod,
      name: 'Crypto Wallet',
      icon: Wallet,
      description: 'Pay with ETH, BTC, or other cryptocurrencies'
    },
    {
      id: 'card' as PaymentMethod,
      name: 'Credit Card',
      icon: CreditCard,
      description: 'Pay with Visa, Mastercard, or American Express'
    },
    {
      id: 'qr' as PaymentMethod,
      name: 'QR Payment',
      icon: QrCode,
      description: 'Scan QR code to pay instantly'
    },
    {
      id: 'bank' as PaymentMethod,
      name: 'Bank Transfer',
      icon: Bank,
      description: 'Direct bank transfer'
    }
  ];

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('details');
  };

  const handleBack = () => {
    setStep('method');
    setSelectedMethod(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-background/90 backdrop-blur-xl p-6 rounded-2xl border border-neon-blue/30 shadow-xl shadow-neon-blue/10 z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-cyber-purple bg-clip-text text-transparent">
                {step === 'method' ? 'Select Payment Method' : 'Payment Details'}
              </h3>
              <button
                onClick={onClose}
                className="text-holo-white/70 hover:text-holo-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Amount Display */}
            <div className="mb-6 p-4 rounded-xl bg-background/50 border border-neon-blue/20">
              <p className="text-sm text-holo-white/70">Total Amount</p>
              <p className="text-2xl font-bold text-neon-blue">{amount} ETH</p>
              <p className="text-sm text-holo-white/50">Ticket #{ticketId}</p>
            </div>

            {step === 'method' ? (
              // Payment Method Selection
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className="w-full p-4 rounded-xl bg-background/50 border border-neon-blue/20 hover:border-neon-blue/40 group transition-all flex items-center justify-between"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <method.icon className="w-6 h-6 text-neon-blue mr-3" />
                      <div className="text-left">
                        <p className="text-holo-white font-medium">{method.name}</p>
                        <p className="text-sm text-holo-white/50">{method.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neon-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                ))}
              </div>
            ) : (
              // Payment Details
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-background/50 border border-neon-blue/20 text-center">
                  <p className="text-holo-white mb-2">Demo Payment Gateway</p>
                  <p className="text-sm text-holo-white/50">
                    This is a demonstration of the payment interface.
                    No actual transaction will be processed.
                  </p>
                </div>
                
                <button
                  onClick={handleBack}
                  className="w-full px-4 py-3 bg-neon-blue/10 rounded-lg text-neon-blue font-medium hover:bg-neon-blue/20 transition-colors"
                >
                  Back to Payment Methods
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal; 