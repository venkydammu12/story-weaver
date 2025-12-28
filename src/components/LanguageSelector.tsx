import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe } from "lucide-react";
import { Language, languageLabels } from "@/data/stories";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSelector = ({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = ["en", "te", "hi"];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-background/80 backdrop-blur-md text-foreground hover:border-primary/60 transition-all duration-300"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">{languageLabels[currentLanguage]}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[140px] rounded-lg border border-primary/20 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              {languages.map((lang) => (
                <motion.button
                  key={lang}
                  onClick={() => {
                    onLanguageChange(lang);
                    setIsOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 ${
                    currentLanguage === lang
                      ? "bg-primary/20 text-primary"
                      : "text-foreground hover:bg-primary/10"
                  }`}
                >
                  {languageLabels[lang]}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
