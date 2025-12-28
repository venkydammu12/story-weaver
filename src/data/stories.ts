export interface Story {
  id: string;
  title: {
    en: string;
    te: string;
    hi: string;
  };
  genre: string;
  duration: string;
  posterTheme: string; // Description for AI poster generation
}

export const stories: Story[] = [
  {
    id: "1",
    title: {
      en: "The Last Light of Hyderabad",
      te: "హైదరాబాద్ చివరి వెలుగు",
      hi: "हैदराबाद की आखिरी रोशनी",
    },
    genre: "Drama",
    duration: "25 min read",
    posterTheme: "A cinematic twilight scene over Charminar with dramatic golden hour lighting, silhouette of ancient architecture against a burning orange sky",
  },
  {
    id: "2",
    title: {
      en: "Whispers in the Godavari",
      te: "గోదావరిలో గుసగుసలు",
      hi: "गोदावरी में फुसफुसाहट",
    },
    genre: "Romance",
    duration: "18 min read",
    posterTheme: "Misty river at dawn with a lone boat, ethereal fog rising from water, romantic moonlight reflecting on gentle waves",
  },
  {
    id: "3",
    title: {
      en: "The Tiger's Shadow",
      te: "పులి నీడ",
      hi: "बाघ की छाया",
    },
    genre: "Thriller",
    duration: "32 min read",
    posterTheme: "Dense jungle with piercing tiger eyes emerging from shadows, dramatic contrast lighting, mysterious and intense atmosphere",
  },
  {
    id: "4",
    title: {
      en: "Songs of the Forgotten Temple",
      te: "మరచిపోయిన దేవాలయ గీతాలు",
      hi: "भूले हुए मंदिर के गीत",
    },
    genre: "Mystery",
    duration: "22 min read",
    posterTheme: "Ancient overgrown temple ruins with mystical light beams piercing through, sacred atmosphere with floating dust particles",
  },
  {
    id: "5",
    title: {
      en: "Between Two Monsoons",
      te: "రెండు వర్షాకాలాల మధ్య",
      hi: "दो मानसूनों के बीच",
    },
    genre: "Drama",
    duration: "28 min read",
    posterTheme: "Dramatic storm clouds over rural landscape, lightning in distance, a lone figure standing in vast fields before the rain",
  },
  {
    id: "6",
    title: {
      en: "The Emperor's Final Dawn",
      te: "చక్రవర్తి చివరి ఉదయం",
      hi: "सम्राट की अंतिम सुबह",
    },
    genre: "Historical",
    duration: "35 min read",
    posterTheme: "Majestic palace silhouette at sunrise, regal atmosphere with golden light, epic scale composition with dramatic clouds",
  },
  {
    id: "7",
    title: {
      en: "Echoes of the Deccan",
      te: "దక్కన్ ప్రతిధ్వనులు",
      hi: "दक्कन की गूँज",
    },
    genre: "Historical",
    duration: "30 min read",
    posterTheme: "Ancient Deccan plateau at dusk, rocky terrain with historic fort ruins, warm amber tones with epic landscape",
  },
  {
    id: "8",
    title: {
      en: "The Weaver's Dream",
      te: "నేత కల",
      hi: "बुनकर का सपना",
    },
    genre: "Drama",
    duration: "20 min read",
    posterTheme: "Traditional loom with colorful silk threads, hands weaving intricate patterns, warm candlelight atmosphere",
  },
];

export type Language = "en" | "te" | "hi";

export const languageLabels: Record<Language, string> = {
  en: "English",
  te: "తెలుగు",
  hi: "हिंदी",
};
