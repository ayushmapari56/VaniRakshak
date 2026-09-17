import type { AudioSamplePreset, RegionalAccent } from '../types';

export const REGIONAL_ACCENTS: RegionalAccent[] = [
  {
    id: 'hindi',
    name: 'Hindi (हिंदी)',
    code: 'hi-IN',
    region: 'North & Central India',
    invarianceScore: 99.4,
    typicalPitchRangeHz: '110 - 240 Hz',
    samplePhrase: 'नमस्ते, मुझे अपने बैंक खाते से तत्काल राशि हस्तांतरित करनी है।'
  },
  {
    id: 'tamil',
    name: 'Tamil (தமிழ்)',
    code: 'ta-IN',
    region: 'Tamil Nadu & Puducherry',
    invarianceScore: 98.9,
    typicalPitchRangeHz: '120 - 260 Hz',
    samplePhrase: 'வணக்கம், எனது வங்கிக் கணக்கிலிருந்து உடனடியாக பணம் அனுப்ப வேண்டும்.'
  },
  {
    id: 'bengali',
    name: 'Bengali (বাংলা)',
    code: 'bn-IN',
    region: 'West Bengal & Tripura',
    invarianceScore: 99.1,
    typicalPitchRangeHz: '115 - 250 Hz',
    samplePhrase: 'নমস্কার, আমার অ্যাকাউন্ট থেকে জরুরি টাকা ট্রান্সফার করতে হবে।'
  },
  {
    id: 'telugu',
    name: 'Telugu (తెలుగు)',
    code: 'te-IN',
    region: 'Andhra Pradesh & Telangana',
    invarianceScore: 98.7,
    typicalPitchRangeHz: '125 - 270 Hz',
    samplePhrase: 'నమస్కారం, నా ఖాతా నుండి అత్యవసరంగా నిధులు బదిలీ చేయాలి.'
  },
  {
    id: 'marathi',
    name: 'Marathi (मराठी)',
    code: 'mr-IN',
    region: 'Maharashtra & Goa',
    invarianceScore: 99.2,
    typicalPitchRangeHz: '110 - 245 Hz',
    samplePhrase: 'नमस्कार, माझ्या खात्यातून तातडीने निधी वर्ग करायचा आहे.'
  },
  {
    id: 'indian_english',
    name: 'Indian English (IN)',
    code: 'en-IN',
    region: 'Pan-India Corporate / Metro',
    invarianceScore: 99.6,
    typicalPitchRangeHz: '100 - 230 Hz',
    samplePhrase: 'Hello, I need to authorize an urgent RTGS wire transfer for the vendor invoice.'
  }
];

export const AUDIO_SAMPLE_PRESETS: AudioSamplePreset[] = [
  {
    id: 'preset-elderly-scam',
    title: 'Senior Citizen Extortion (Cloned Grandson Voice)',
    subtitle: 'Generated via ElevenLabs Neural Voice Clone with artificial urgency',
    category: 'deepfake_scam',
    language: 'Hindi / English (Hinglish)',
    accent: 'Delhi Metro',
    provider: 'ElevenLabs Voice Clone (Neural TTS)',
    expectedRisk: 92,
    codec: 'AMR-WB (Cellular 2G/3G)',
    scenarioDescription: 'Scammer uses 3-second Instagram reel voice sample to clone grandson’s voice, claiming an emergency arrest in police station demanding ₹1,80,000 immediate UPI/NEFT transfer.',
    transactionAmount: 180000,
    unverifiedGateway: true,
    callerName: 'Aarav Sharma (Impersonated)',
    audioDurationSec: 6.5
  },
  {
    id: 'preset-ceo-fraud',
    title: 'CEO Urgent Wire Transfer Authorization',
    subtitle: 'High-fidelity Play.ht & DiffWave Neural Vocoder clone',
    category: 'ceo_fraud',
    language: 'Indian English',
    accent: 'Corporate Bengaluru',
    provider: 'DiffWave + FastSpeech2 Neural Clone',
    expectedRisk: 88,
    codec: 'VoLTE 4G HD',
    scenarioDescription: 'AI deepfake impersonating Enterprise CEO contacting Finance Controller over WhatsApp VoIP call requesting immediate ₹8,50,000 RTGS clearance for an undisclosed acquisition.',
    transactionAmount: 850000,
    unverifiedGateway: true,
    callerName: 'Vikram Malhotra (Managing Director)',
    audioDurationSec: 8.0
  },
  {
    id: 'preset-indictts-scam',
    title: 'IndicTTS Cloned Voice KYC Scam (Bengali)',
    subtitle: 'AI4Bharat / FastPitch Bengali Synthetic Model with unnatural pauses',
    category: 'deepfake_scam',
    language: 'Bengali',
    accent: 'Kolkata Urban',
    provider: 'IndicTTS Neural Clone',
    expectedRisk: 84,
    codec: '16kHz PCM',
    scenarioDescription: 'Automated synthetic caller imitating a State Bank Manager threatening electricity/KYC suspension unless ₹50,000 security deposit is wired.',
    transactionAmount: 50000,
    unverifiedGateway: true,
    callerName: 'Branch Manager (Spoofed ID)',
    audioDurationSec: 7.2
  },
  {
    id: 'preset-genuine-tamil',
    title: 'Authentic Customer Support Call (Tamil)',
    subtitle: '100% Organic Human Voice with dynamic prosody and natural breathing',
    category: 'genuine_human',
    language: 'Tamil',
    accent: 'Chennai Central',
    provider: 'Organic Human Speech (Clean)',
    expectedRisk: 12,
    codec: 'VoLTE 4G HD',
    scenarioDescription: 'Verified citizen inquiring about fixed deposit interest rates. Exhibits high natural pitch variance, micro-pauses, and glottal pulse integrity.',
    transactionAmount: 25000,
    unverifiedGateway: false,
    callerName: 'Karthik Ramanathan (Verified Customer)',
    audioDurationSec: 9.0
  },
  {
    id: 'preset-genuine-hindi-noisy',
    title: 'Authentic Hindi Call in Noisy Cellular Traffic',
    subtitle: 'Real human speech subjected to AMR-WB 2G/3G codec compression',
    category: 'noisy_cellular',
    language: 'Hindi',
    accent: 'Lucknow Awadhi',
    provider: 'Organic Human Speech (RawBoost Noise)',
    expectedRisk: 22,
    codec: 'AMR-WB (Cellular 2G/3G)',
    scenarioDescription: 'Authentic caller on a bustling roadside cellular connection. Demonstrates VaniRakshak’s RawBoost acoustic invariance against false-positive network compression.',
    transactionAmount: 40000,
    unverifiedGateway: false,
    callerName: 'Pooja Verma (Verified Customer)',
    audioDurationSec: 7.8
  },
  {
    id: 'preset-genuine-corporate',
    title: 'Authentic CFO Voice Verification (Indian English)',
    subtitle: 'Organic executive speaker confirming authentic quarterly vendor payment',
    category: 'genuine_human',
    language: 'Indian English',
    accent: 'Mumbai Business',
    provider: 'Organic Human Speech (Clean)',
    expectedRisk: 8,
    codec: 'Opus Clean',
    scenarioDescription: 'Verified Chief Financial Officer verbally authorizing routine enterprise payroll settlement with authentic vocal fold vibration and natural harmonic ratios.',
    transactionAmount: 1200000,
    unverifiedGateway: false,
    callerName: 'Ananya Deshmukh (Chief Financial Officer)',
    audioDurationSec: 8.5
  }
];
