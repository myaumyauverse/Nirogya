import React, { useEffect, useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';

const WaterDiseases: React.FC = () => {
  const { t } = useLanguage()

  const diseases = [
    {
      name: t('diseases.cholera'),
      description: t('diseases.choleraDesc')
    },
    {
      name: t('diseases.typhoid'),
      description: t('diseases.typhoidDesc')
    },
    {
      name: t('diseases.dysentery'),
      description: t('diseases.dysenteryDesc')
    },
    {
      name: t('home.hepatitisA'),
      description: t('home.hepatitisADesc')
    },
    {
      name: t('diseases.giardiasis'),
      description: t('diseases.giardiasisDesc')
    }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showText, setShowText] = useState(false);
  const [dropFalling, setDropFalling] = useState(true);
  const [showRipple, setShowRipple] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Reset animations
      setDropFalling(true);
      setShowText(false);
      setShowRipple(false);

      // Droplet falls first
      setTimeout(() => {
        setDropFalling(false);
        setShowRipple(true);
      }, 1200); // droplet duration

      // Text appears slightly after ripple starts
      setTimeout(() => {
        setShowText(true);
      }, 1500);

      // Hide text & move to next disease
      setTimeout(() => {
        setShowText(false);
        setCurrentIndex((prev) => (prev + 1) % diseases.length);
      }, 5000);
    }, 5500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[400px] overflow-hidden">
      {/* Droplet */}
      {dropFalling && (
        <div className="absolute top-0 animate-[dropFall_1.2s_ease-in_forwards]">
          <div className="w-10 h-14 bg-sky-400 rounded-[50%_50%_50%_50%/65%_65%_35%_35%] shadow-lg shadow-sky-300"></div>
        </div>
      )}

      {/* Ripple */}
      {showRipple && (
        <div className="absolute top-[300px] left-1/2 -translate-x-1/2 animate-[ripple_1s_ease-out_forwards] rounded-full border-4 border-sky-300"></div>
      )}

      {/* Disease Info */}
      {showText && (
        <div className="flex flex-col items-center text-center mt-36 animate-[textRipple_1s_ease-out_forwards]">
          <h2 className="text-3xl font-bold text-sky-500 mb-2">
            {diseases[currentIndex].name}
          </h2>
          <p className="text-gray-700 max-w-md text-base">
            {diseases[currentIndex].description}
          </p>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes dropFall {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(300px); opacity: 0; }
        }
        @keyframes ripple {
          0% { width: 0; height: 0; opacity: 0.7; }
          100% { width: 220px; height: 220px; opacity: 0; }
        }
        @keyframes textRipple {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WaterDiseases;
