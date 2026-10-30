# 🇮🇳 BolEnglish (बोल इंग्लिश) – AI Voice English Speaking Practice

> **बोलकर अंग्रेज़ी सीखने का सबसे आसान और दोस्ताना तरीका!**  
> A voice-first English conversation tutor powered by Google Gemini, designed for Indian learners of all ages (from 6-year-old Class 1 kids to adults) with real-time speech recognition, natural AI voice, and gentle grammar corrections with Hindi explanations.

---

## ✨ Features (मुख्य विशेषताएं)

1. **🎙️ Voice Conversation Loop (बोलकर बातचीत)**
   - बड़ा "Tap to Speak" माइक बटन (Web Speech API, Indian English `en-IN` और `en-US` सपोर्ट)।
   - AI का जवाब स्वाभाविक आवाज़ (Text-to-Speech) में।
   - धीमी/सामान्य गति (Slow 0.8x / Normal 1.0x) और महिला/पुरुष आवाज़ का विकल्प।
   - ऑडियो को दोबारा सुनने के लिए "Listen again" रीप्ले बटन।
   - Safari या बिना माइक वाले ब्राउज़र के लिए ऑटोमैटिक टाइपिंग इनपुट फॉलबैक।

2. **💡 Gentle Correction (प्यार से गलती सुधारना)**
   - हर वाक्य के बाद AI पहले प्रोत्साहित करता है ("Good try!").
   - यदि कोई गलती हो, तो **"Better way to say it"** कार्ड दिखाता है: आपने क्या कहा ➔ सही वाक्य ➔ 1-लाइन का सरल नियम।
   - **"Explain in Hindi"** टॉगल बटन से हिंदी में नियम समझें।
   - बच्चों के लिए एक बार में केवल 1 मुख्य गलती समझाई जाती है।

3. **👤 Age / Level Profiles (आयु और स्तर के अनुसार प्रोफाइल)**
   - **Little Learner (5-8 साल / Class 1-3)**: छोटे वाक्य, धीमी आवाज़, जानवरों, रंगों, परिवार की बातें, तारे और कंफेटी सेलिब्रेशन।
   - **Student (9-15 साल / Class 4-10)**: स्कूल, दोस्त, कहानियाँ, ग्रामर (tenses, prepositions)।
   - **Adult / Professional**: दैनिक बातचीत, ऑफिस, इंटरव्यू, खरीदारी और यात्रा।
   - कठिनाई स्तर: Beginner, Intermediate, Advanced।
   - एक ही डिवाइस पर कई प्रोफाइल (जैसे "आरव", "रिया", "पापा") बिना किसी लॉगिन के।

4. **🎯 4 Practice Modes (अभ्यास के 4 तरीके)**
   - **Free Talk**: खुली बातचीत।
   - **Role-Play**: 6 वास्तविक जीवन की परिस्थितियां (किराने की दुकान, स्कूल, डॉक्टर, रेस्तरां, अपना परिचय, नौकरी का इंटरव्यू)।
   - **Daily Topic**: आज का नया विषय और बातचीत शुरू करने के आसान सुझाव।
   - **Repeat After Me**: उच्चारण अभ्यास – AI बोलता है, आप दोहराते हैं और आपको स्टार स्कोर (0-100%) मिलता है।

5. **🛡️ 100% Child-Safe & Private (बच्चों के लिए पूर्णतः सुरक्षित)**
   - कोई हिंसक या अनुचित बातचीत नहीं; ट्यूटर हमेशा अच्छी बातों पर वापस ले आता है।
   - कोई निजी जानकारी (नाम, पता, स्कूल) नहीं पूछी जाती।
   - आवाज़ की कोई रिकॉर्डिंग कहीं सेव नहीं होती।
   - **Parent Zone**: 4-अंकों के गुप्त पिन (डिफ़ॉल्ट: `1234`) से सुरक्षित पैरेंट डैशबोर्ड, जहाँ आप बच्चों की प्रोग्रेस, गलतियों की डायरी और शब्दावली देख सकते हैं।

6. **📱 Progressive Web App (PWA)**
   - मोबाइल (Android/iPhone) और कंप्यूटर दोनों पर चलता है।
   - ब्राउज़र मेनू से सीधे होम स्क्रीन पर "Add to Home Screen / Install" करें।

---

## 🚀 Local Development (अपने कंप्यूटर पर कैसे चलाएं)

### 1. प्रोजेक्ट फ़ोल्डर में जाएं:
```bash
cd english-speaking-tutor
```

### 2. पैकेज इनस्टॉल करें:
```bash
npm install
```

### 3. ऐप शुरू करें:
```bash
npm run dev
```
टर्मिनल में आपको एक लिंक मिलेगा (जैसे `http://localhost:5173`)। इसे Chrome या Edge ब्राउज़र में खोलें और माइक अनुमति (Microphone permission) दें।

---

## 🔑 Google Gemini API Key कैसे प्राप्त करें (मुफ्त)

> [!IMPORTANT]
> अपनी API Key को कभी भी किसी को न दिखाएं और न ही Git में कमिट करें।

1. **[https://aistudio.google.com/](https://aistudio.google.com/)** पर जाएं।
2. अपने Gmail अकाउंट से लॉगिन करें।
3. ऊपर बाईं तरफ **"Get API key"** पर क्लिक करें।
4. **"Create API key"** ➔ **"Create API key in new project"** चुनें।
5. जनरेट हुई Key को कॉपी करके सुरक्षित रख लें।

---

## ☁️ Cloudflare Pages पर डिप्लॉयमेंट और Secret जोड़ना

यह ऐप **Cloudflare Pages Functions** (`functions/api/chat.ts`) को सर्वरलेस बैकएंड के रूप में इस्तेमाल करता है ताकि आपकी Gemini API Key सुरक्षित रहे।

### तरीका 1: Cloudflare Dashboard से (सबसे आसान)
1. अपने GitHub अकाउंट पर `english-speaking-tutor` नाम से रिपॉजिटरी बनाएं और कोड पुश करें।
2. **[dash.cloudflare.com](https://dash.cloudflare.com/)** पर लॉगिन करें।
3. **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git** चुनें।
4. अपनी `english-speaking-tutor` रिपॉजिटरी चुनें।
5. Build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. **Environment variables (Advanced)** में:
   - **Variable name**: `GEMINI_API_KEY`
   - **Value**: अपनी Gemini API Key डालें और **Encrypt** चुनें।
7. **Save and Deploy** पर क्लिक करें। 2 मिनट में आपका ऐप दुनिया भर के लिए लाइव हो जाएगा!

### तरीका 2: Wrangler CLI से (कमांड लाइन)
```bash
npx wrangler pages secret put GEMINI_API_KEY
```

---

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Tailwind Animations
- **Voice**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
- **Backend / Proxy**: Cloudflare Pages Functions (`/api/chat`)
- **AI Brain**: Google Gemini 2.5 Flash / 1.5 Flash

---

## 📄 License
MIT License. Free to use and customize!
