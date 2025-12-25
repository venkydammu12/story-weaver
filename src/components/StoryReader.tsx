import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Headphones, BookOpen, Languages, X } from "lucide-react";
import { useState } from "react";

interface StoryReaderProps {
  onBack?: () => void;
}

type Language = "english" | "telugu" | "hindi";

const storyContent: Record<Language, {
  title: string;
  author: string;
  chapters: {
    title: string;
    subtitle: string;
    paragraphs: string[];
  }[];
}> = {
  english: {
    title: "The Last Light of Hyderabad",
    author: "Raghav Krishna",
    chapters: [
      {
        title: "Chapter One",
        subtitle: "The Beginning of Dusk",
        paragraphs: [
          "The ancient stones of the Charminar stood silent as the sun began its descent, painting the sky in shades of amber and deep crimson. Arjun watched from the rooftop of his family's haveli, the city spread before him like a tapestry woven with centuries of stories.",
          "He had always loved this hour—the moment when day surrendered to night, when the call to prayer echoed across the old city and the lights began to flicker on like earthbound stars. But tonight, something felt different. A weight hung in the air, heavy with secrets yet to be revealed.",
          "His grandmother had spoken of such nights. Nights when the veil between past and present grew thin, when the ghosts of the Nizam's court still walked the marble halls of the Falaknuma Palace. Arjun had dismissed her tales as the fancies of an aging mind, but now, watching the shadows lengthen across the Musi river, he wasn't so certain.",
          "The letter had arrived that morning—yellowed paper sealed with wax bearing an insignia he didn't recognize. Inside, a single line written in elegant Urdu script: 'The keeper of secrets awaits the heir at the hour of the last light.'",
          "Arjun traced the words again, feeling the slight indentation of the pen strokes beneath his fingertips. Someone knew. Someone remembered what his family had worked so hard to forget.",
        ],
      },
    ],
  },
  telugu: {
    title: "హైదరాబాద్ చివరి వెలుగు",
    author: "రాఘవ్ కృష్ణ",
    chapters: [
      {
        title: "మొదటి అధ్యాయం",
        subtitle: "సంధ్య ప్రారంభం",
        paragraphs: [
          "సూర్యుడు అస్తమించడం ప్రారంభించగా, చార్మినార్ పురాతన రాళ్ళు నిశ్శబ్దంగా నిలబడ్డాయి, ఆకాశాన్ని పసుపు మరియు ముదురు ఎరుపు రంగుల్లో చిత్రీకరించాయి. అర్జున్ తన కుటుంబం హవేలీ పైకప్పు నుండి చూస్తూ, శతాబ్దాల కథలతో అల్లిన వస్త్రంలా నగరం అతని ముందు విస్తరించింది.",
          "అతను ఎల్లప్పుడూ ఈ సమయాన్ని ప్రేమించాడు—పగలు రాత్రికి లొంగిపోయే క్షణం, పాత నగరం అంతటా ప్రార్థన పిలుపు ప్రతిధ్వనించినప్పుడు మరియు భూమిపై నక్షత్రాలలా దీపాలు మెరవడం ప్రారంభించినప్పుడు. కానీ ఈ రాత్రి, ఏదో భిన్నంగా అనిపించింది. ఇంకా వెల్లడికాని రహస్యాలతో బరువుగా గాలిలో ఏదో వ్రేలాడుతోంది.",
          "అతని నానమ్మ అలాంటి రాత్రుల గురించి చెప్పేది. గతం మరియు వర్తమానం మధ్య తెర సన్నబడిన రాత్రులు, నిజాం దర్బారు దయ్యాలు ఇప్పటికీ ఫలక్‌నుమా ప్యాలెస్ పాలరాయి హాళ్ళలో నడిచేవి. అర్జున్ ఆమె కథలను వృద్ధాప్య మనసు ఊహలుగా కొట్టిపారేశాడు, కానీ ఇప్పుడు, మూసీ నది మీదుగా నీడలు పొడవుగా మారడం చూస్తూ, అతనికి అంత నిశ్చయంగా లేదు.",
          "ఉత్తరం ఆ ఉదయం వచ్చింది—అతనికి గుర్తు లేని ముద్రతో మైనంతో సీల్ చేయబడిన పసుపు కాగితం. లోపల, అందమైన ఉర్దూ లిపిలో వ్రాయబడిన ఒక్క వాక్యం: 'చివరి వెలుగు సమయంలో వారసుడి కోసం రహస్యాల సంరక్షకుడు వేచి ఉన్నాడు.'",
          "అర్జున్ మళ్ళీ పదాలను గీస్తూ, తన వేళ్ల కింద పెన్ స్ట్రోక్‌ల స్వల్ప ఇండెంటేషన్‌ను అనుభవించాడు. ఎవరో తెలుసు. అతని కుటుంబం మర్చిపోవడానికి చాలా కష్టపడింది దాన్ని ఎవరో గుర్తుంచుకున్నారు.",
        ],
      },
    ],
  },
  hindi: {
    title: "हैदराबाद की आखिरी रोशनी",
    author: "राघव कृष्णा",
    chapters: [
      {
        title: "पहला अध्याय",
        subtitle: "शाम की शुरुआत",
        paragraphs: [
          "चारमीनार के प्राचीन पत्थर खामोश खड़े थे जब सूरज ढलने लगा, आसमान को सुनहरे और गहरे लाल रंगों में रंगता हुआ। अर्जुन अपने परिवार की हवेली की छत से देख रहा था, शहर उसके सामने सदियों की कहानियों से बुनी एक तस्वीर की तरह फैला हुआ था।",
          "उसे हमेशा इस घड़ी से प्यार था—वह पल जब दिन रात के सामने झुक जाता, जब पुराने शहर में अजान गूंजती और रोशनियां धरती के तारों की तरह टिमटिमाने लगतीं। लेकिन आज रात, कुछ अलग लग रहा था। हवा में एक भारीपन था, अभी तक न खुले रहस्यों से भरा।",
          "उसकी दादी ऐसी रातों के बारे में बताती थीं। वो रातें जब अतीत और वर्तमान के बीच का पर्दा पतला हो जाता था, जब निज़ाम के दरबार के भूत अभी भी फलकनुमा पैलेस के संगमरमर के गलियारों में चलते थे। अर्जुन ने उनकी कहानियों को बुढ़ापे की कल्पना मानकर खारिज कर दिया था, लेकिन अब, मूसी नदी पर छायाएं लंबी होती देखते हुए, उसे इतना यकीन नहीं था।",
          "पत्र उस सुबह आया था—पीला कागज़ जिस पर एक ऐसी मुहर लगी थी जिसे वह नहीं पहचानता था। अंदर, सुंदर उर्दू लिपि में लिखी एक पंक्ति: 'रहस्यों का रक्षक आखिरी रोशनी के समय वारिस की प्रतीक्षा कर रहा है।'",
          "अर्जुन ने फिर से शब्दों पर उंगली फेरी, अपनी उंगलियों के नीचे कलम के निशानों को महसूस करते हुए। कोई जानता था। कोई याद रखता था जिसे उसके परिवार ने भुलाने की बहुत कोशिश की थी।",
        ],
      },
    ],
  },
};

const languageLabels: Record<Language, string> = {
  english: "English",
  telugu: "తెలుగు",
  hindi: "हिंदी",
};

export const StoryReader = ({ onBack }: StoryReaderProps) => {
  const [showLanguagePanel, setShowLanguagePanel] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("english");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentStory = storyContent[selectedLanguage];

  const handleLanguageChange = (language: Language) => {
    if (language === selectedLanguage) {
      setShowLanguagePanel(false);
      return;
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedLanguage(language);
      setIsTransitioning(false);
      setShowLanguagePanel(false);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      {/* Floating back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back</span>
      </motion.button>

      {/* Current language indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed top-8 right-8 z-40"
      >
        <span className="text-xs text-muted-foreground spacing-cinematic uppercase">
          {languageLabels[selectedLanguage]}
        </span>
      </motion.div>

      {/* Story content */}
      <motion.article 
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto px-8 py-32 md:py-40"
      >
        {/* Title block */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-16 md:mb-24 text-center"
        >
          <p className="text-primary/70 spacing-cinematic text-xs uppercase mb-4">
            {currentStory.author}
          </p>
          <h1 className="font-display text-3xl md:text-5xl text-foreground mb-8">
            {currentStory.title}
          </h1>
          <div className="w-16 h-px bg-primary/30 mx-auto" />
        </motion.header>

        {/* Chapter */}
        {currentStory.chapters.map((chapter, chapterIndex) => (
          <motion.section
            key={`${selectedLanguage}-${chapterIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mb-12">
              <p className="text-muted-foreground spacing-cinematic text-xs uppercase mb-2">
                {chapter.title}
              </p>
              <h2 className="font-display text-xl md:text-2xl text-foreground italic">
                {chapter.subtitle}
              </h2>
            </div>

            <div className="space-y-6">
              {chapter.paragraphs.map((paragraph, pIndex) => (
                <motion.p
                  key={`${selectedLanguage}-${pIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + pIndex * 0.1 }}
                  className={`text-foreground/90 leading-[1.9] text-lg font-body transition-all duration-500 ${
                    currentLine === pIndex
                      ? "text-foreground bg-primary/5 -mx-4 px-4 py-2 rounded border-l-2 border-primary/40"
                      : ""
                  }`}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </motion.section>
        ))}
      </motion.article>

      {/* Floating control panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-4 bg-card/80 backdrop-blur-lg border border-border/30 rounded-full px-6 py-3">
          {/* Listen button */}
          <motion.button
            onClick={() => {
              setIsListening(!isListening);
              setCurrentLine(isListening ? null : 0);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              isListening
                ? "bg-primary/20 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Headphones className="w-4 h-4" />
            <span className="text-xs spacing-cinematic uppercase">
              {isListening ? "Listening" : "Listen"}
            </span>
          </motion.button>

          <div className="w-px h-6 bg-border/50" />

          {/* Language options button */}
          <motion.button
            onClick={() => setShowLanguagePanel(!showLanguagePanel)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
              showLanguagePanel
                ? "bg-primary/20 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Languages className="w-4 h-4" />
            <span className="text-xs spacing-cinematic uppercase">Language</span>
          </motion.button>
        </div>

        {/* Language selection panel */}
        <AnimatePresence>
          {showLanguagePanel && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-card/95 backdrop-blur-lg border border-border/30 rounded-2xl p-2 min-w-[200px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
                <span className="text-xs text-muted-foreground spacing-cinematic uppercase">
                  Select Language
                </span>
                <button
                  onClick={() => setShowLanguagePanel(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Language options */}
              <div className="p-2 space-y-1">
                {(Object.keys(languageLabels) as Language[]).map((lang) => (
                  <motion.button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                      selectedLanguage === lang
                        ? "bg-primary/15 text-primary"
                        : "hover:bg-muted/50 text-foreground/80 hover:text-foreground"
                    }`}
                  >
                    <span className="font-medium">{languageLabels[lang]}</span>
                    {selectedLanguage === lang && (
                      <motion.div
                        layoutId="selectedLang"
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Listening indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-card/80 backdrop-blur-lg border border-border/30 rounded-full px-4 py-2"
        >
          <div className="flex items-center gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  height: [8, 16, 8],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Narrating...</span>
        </motion.div>
      )}
    </motion.div>
  );
};
