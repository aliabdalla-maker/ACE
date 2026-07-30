import React, { useState, useRef } from 'react';
import {
  Sparkles, X, MessageSquare, Search, MapPin, Image as ImageIcon,
  Video, Mic, Music, Brain, Zap, Send, Upload, Play, Pause,
  RefreshCw, Layers, CheckCircle2, Globe, Shield, Volume2
} from 'lucide-react';

interface AIFeatureSuiteModalProps {
  onClose: () => void;
  onApplyImageToListing?: (imageUrl: string) => void;
}

export function AIFeatureSuiteModal({ onClose, onApplyImageToListing }: AIFeatureSuiteModalProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'grounding' | 'media' | 'image_gen' | 'video_gen' | 'voice' | 'music'>('chat');

  // 1. Chatbot State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string; thinking?: boolean }>>([
    { role: 'model', text: 'Welcome to ACE AI Studio Intelligence! How can I assist with your hourly assets, trade valuations, market analysis, or time credits today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState<'standard' | 'complex' | 'low-latency'>('standard');
  const [enableHighThinking, setEnableHighThinking] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  // 2. Search & Maps Grounding State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ text: string; sources?: Array<{ title: string; uri: string }> } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [mapsQuery, setMapsQuery] = useState('');
  const [mapsResults, setMapsResults] = useState<string | null>(null);
  const [mapsLoading, setMapsLoading] = useState(false);

  // 3. Media Analysis State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisPrompt, setAnalysisPrompt] = useState('Analyze condition, luxury score, and estimated market hourly rental rate in USD.');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);

  // 4. Image Gen State
  const [imagePrompt, setImagePrompt] = useState('Luxury executive penthouse suite with infinity pool and city skyline at twilight, cinematic lighting');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9'>('16:9');
  const [imageResolution, setImageResolution] = useState<'1K' | '2K' | '4K'>('2K');
  const [imageQuality, setImageQuality] = useState<'flash' | 'pro'>('pro');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  // 5. Video Gen State (Veo)
  const [videoPrompt, setVideoPrompt] = useState('Slow motion cinematic pan across luxury private yacht deck over crystal blue waters');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  // 6. Voice & Transcription State
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptText, setTranscriptText] = useState<string | null>(null);
  const [voiceLiveActive, setVoiceLiveActive] = useState(false);
  const [transcribingLoading, setTranscribingLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 7. Music Gen State (Lyria)
  const [musicPrompt, setMusicPrompt] = useState('Chill ambient jazz lounge with saxophone and smooth electric piano background');
  const [musicLength, setMusicLength] = useState<'clip' | 'full'>('clip');
  const [generatedMusic, setGeneratedMusic] = useState<{ audioUrl: string; title: string; duration: string } | null>(null);
  const [musicLoading, setMusicLoading] = useState(false);

  // Handlers
  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    const newMsgs = [...chatMessages, { role: 'user' as const, text: userMsg }];
    setChatMessages(newMsgs);
    setChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs,
          mode: chatMode,
          thinking: enableHighThinking && chatMode === 'complex'
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'model', text: data.response || 'No response returned.' }]);
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'model', text: 'Error connecting to Gemini API server.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRunSearch = async () => {
    if (!searchQuery.trim() || searchLoading) return;
    setSearchLoading(true);
    try {
      const res = await fetch('/api/gemini/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (e) {
      setSearchResults({ text: 'Search grounding failed.' });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRunMaps = async () => {
    if (!mapsQuery.trim() || mapsLoading) return;
    setMapsLoading(true);
    try {
      const res = await fetch('/api/gemini/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationQuery: mapsQuery })
      });
      const data = await res.json();
      setMapsResults(data.text);
    } catch (e) {
      setMapsResults('Maps grounding failed.');
    } finally {
      setMapsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyzeMedia = async () => {
    if (!selectedFile && !previewUrl) return;
    setMediaLoading(true);
    try {
      let base64Data = '';
      if (selectedFile) {
        base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(selectedFile);
        });
      }

      const isVid = selectedFile?.type.startsWith('video');

      const res = await fetch('/api/gemini/analyze-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          prompt: analysisPrompt,
          mediaType: isVid ? 'video' : 'image',
          mimeType: selectedFile?.type || 'image/jpeg'
        })
      });
      const data = await res.json();
      setAnalysisResult(data.analysis);
    } catch (e) {
      setAnalysisResult('Media analysis failed.');
    } finally {
      setMediaLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || imageLoading) return;
    setImageLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio,
          resolution: imageResolution,
          quality: imageQuality
        })
      });
      const data = await res.json();
      if (data.imageUrl) setGeneratedImageUrl(data.imageUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim() || videoLoading) return;
    setVideoLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: videoAspectRatio
        })
      });
      const data = await res.json();
      if (data.videoUrl) setGeneratedVideoUrl(data.videoUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setVideoLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setTranscribingLoading(true);
          try {
            const res = await fetch('/api/gemini/transcribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio })
            });
            const data = await res.json();
            setTranscriptText(data.transcript);
          } catch (e) {
            setTranscriptText('Transcription failed.');
          } finally {
            setTranscribingLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      alert('Microphone access denied or unavailable.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim() || musicLoading) return;
    setMusicLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt, mode: musicLength })
      });
      const data = await res.json();
      setGeneratedMusic(data);
    } catch (e) {
      console.error(e);
    } finally {
      setMusicLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <span>ACE AI Studio Intelligence Suite</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30">Gemini 3.5 & Veo & Lyria</span>
              </h2>
              <p className="text-xs text-slate-400">Multi-turn Chat, High Thinking, Search & Maps Grounding, Image/Video Studio, Voice Live & Music</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'chat' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Chat & Thinking</span>
          </button>

          <button
            onClick={() => setActiveTab('grounding')}
            className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'grounding' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search & Maps Grounding</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'media' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Image & Video Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('image_gen')}
            className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'image_gen' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Gen & Edit</span>
          </button>

          <button
            onClick={() => setActiveTab('video_gen')}
            className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'video_gen' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Veo Video Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'voice' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Live & Transcribe</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`px-3 py-2 rounded-xl font-medium flex items-center gap-1.5 whitespace-nowrap transition ${activeTab === 'music' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Lyria Music Gen</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: Multi-Turn Chatbot */}
          {activeTab === 'chat' && (
            <div className="space-y-4 flex flex-col h-full min-h-[400px]">
              {/* Top Model Controls */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium">Model Profile:</span>
                  <button
                    onClick={() => setChatMode('standard')}
                    className={`px-2.5 py-1 rounded-lg border transition ${chatMode === 'standard' ? 'bg-indigo-600 border-indigo-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                  >
                    Flash 3.5 (General)
                  </button>
                  <button
                    onClick={() => setChatMode('complex')}
                    className={`px-2.5 py-1 rounded-lg border transition ${chatMode === 'complex' ? 'bg-purple-600 border-purple-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                  >
                    Pro 3.1 (Complex)
                  </button>
                  <button
                    onClick={() => setChatMode('low-latency')}
                    className={`px-2.5 py-1 rounded-lg border transition ${chatMode === 'low-latency' ? 'bg-emerald-600 border-emerald-500 text-white font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                  >
                    Flash-Lite (Fast)
                  </button>
                </div>

                {chatMode === 'complex' && (
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                    <input
                      type="checkbox"
                      checked={enableHighThinking}
                      onChange={(e) => setEnableHighThinking(e.target.checked)}
                      className="rounded accent-purple-500"
                    />
                    <Brain className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-300 font-medium">Enable High Thinking Mode</span>
                  </label>
                )}
              </div>

              {/* Chat Thread */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex-1 overflow-y-auto space-y-3 max-h-[350px]">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'model' && (
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex gap-2 items-center text-xs text-amber-400 font-mono animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini AI is reasoning & composing response...</span>
                  </div>
                )}
              </div>

              {/* Input Box */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Gemini AI about pricing, valuation, trading tactics, or time credits..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleSendChat}
                  disabled={chatLoading}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 px-5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Search & Maps Grounding */}
          {activeTab === 'grounding' && (
            <div className="space-y-6">
              {/* Google Search Grounding Section */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider">
                  <Search className="w-4 h-4" />
                  <span>Google Search Grounding (Live Market Quotes)</span>
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search e.g. Current hourly luxury yacht rental rate in Monaco"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleRunSearch}
                    disabled={searchLoading}
                    className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1"
                  >
                    {searchLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                    <span>Search</span>
                  </button>
                </div>

                {searchResults && (
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs space-y-2">
                    <p className="text-slate-200 leading-relaxed">{searchResults.text}</p>
                    {searchResults.sources && searchResults.sources.length > 0 && (
                      <div className="border-t border-slate-800 pt-2">
                        <span className="text-[10px] text-slate-400 block font-bold">Grounded Sources:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {searchResults.sources.map((s, idx) => (
                            <a
                              key={idx}
                              href={s.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-amber-400 underline hover:text-amber-300"
                            >
                              {s.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Google Maps Grounding Section */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Google Maps Grounding (Venue & Airport Verification)</span>
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Location query e.g. Hotel Arts Barcelona executive penthouse suite"
                    value={mapsQuery}
                    onChange={(e) => setMapsQuery(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleRunMaps}
                    disabled={mapsLoading}
                    className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1"
                  >
                    {mapsLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                    <span>Locate</span>
                  </button>
                </div>

                {mapsResults && (
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs text-slate-200 leading-relaxed">
                    {mapsResults}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Image & Video Analysis */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Upload Asset Photo / Video for Visual Appraisal</span>
                </h3>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <label className="cursor-pointer bg-slate-900 border border-dashed border-slate-700 hover:border-amber-500 p-6 rounded-xl text-center flex-1 w-full flex flex-col items-center justify-center gap-2 transition">
                    <Upload className="w-6 h-6 text-amber-400" />
                    <span className="text-xs font-medium text-slate-300">Click to upload photo or video</span>
                    <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                  </label>

                  {previewUrl && (
                    <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative shrink-0">
                      {selectedFile?.type.startsWith('video') ? (
                        <video src={previewUrl} className="w-full h-full object-cover" />
                      ) : (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-mono">Appraisal & Condition Prompt:</label>
                  <input
                    type="text"
                    value={analysisPrompt}
                    onChange={(e) => setAnalysisPrompt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={handleAnalyzeMedia}
                  disabled={mediaLoading || (!selectedFile && !previewUrl)}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  {mediaLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                  <span>Run Gemini Pro 3.1 Visual Appraisal</span>
                </button>

                {analysisResult && (
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-amber-200 leading-relaxed font-mono">
                    <span className="text-[10px] text-amber-400 font-bold block mb-1">APPRAISAL REPORT:</span>
                    {analysisResult}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Image Generation & Editing */}
          {activeTab === 'image_gen' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Gemini Studio Image Generation & Custom Aspect Ratio</span>
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setImageQuality('flash')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${imageQuality === 'flash' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      Flash Image Preview
                    </button>
                    <button
                      onClick={() => setImageQuality('pro')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${imageQuality === 'pro' ? 'bg-indigo-600 text-white font-bold border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                    >
                      Pro Image Studio
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-mono">Text Prompt:</label>
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Aspect Ratios & Resolution Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 font-mono block mb-1">Aspect Ratio:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'] as const).map((ar) => (
                        <button
                          key={ar}
                          onClick={() => setAspectRatio(ar)}
                          className={`px-2 py-1 rounded text-[10px] font-mono border transition ${aspectRatio === ar ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                        >
                          {ar}
                        </button>
                      ))}
                    </div>
                  </div>

                  {imageQuality === 'pro' && (
                    <div>
                      <label className="text-[10px] text-slate-400 font-mono block mb-1">Resolution Affordance:</label>
                      <div className="flex gap-2">
                        {(['1K', '2K', '4K'] as const).map((res) => (
                          <button
                            key={res}
                            onClick={() => setImageResolution(res)}
                            className={`px-3 py-1 rounded text-xs font-mono border transition ${imageResolution === res ? 'bg-indigo-600 text-white font-bold border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGenerateImage}
                  disabled={imageLoading}
                  className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  {imageLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate High-Quality Image</span>
                </button>

                {generatedImageUrl && (
                  <div className="space-y-2">
                    <img src={generatedImageUrl} alt="Generated" className="w-full h-64 object-cover rounded-xl border border-slate-800 shadow-xl" />
                    {onApplyImageToListing && (
                      <button
                        onClick={() => onApplyImageToListing(generatedImageUrl)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Use Image in Marketplace Listing</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Veo Video Generation */}
          {activeTab === 'video_gen' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span>Veo 3.1 Video Generation (Text to Video & Animate Image)</span>
                </h3>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-mono">Video Scene Description:</label>
                  <input
                    type="text"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex gap-3 items-center text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">Format:</span>
                  <button
                    onClick={() => setVideoAspectRatio('16:9')}
                    className={`px-3 py-1 rounded text-xs font-mono border transition ${videoAspectRatio === '16:9' ? 'bg-indigo-600 text-white font-bold border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                  >
                    16:9 Landscape
                  </button>
                  <button
                    onClick={() => setVideoAspectRatio('9:16')}
                    className={`px-3 py-1 rounded text-xs font-mono border transition ${videoAspectRatio === '9:16' ? 'bg-indigo-600 text-white font-bold border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                  >
                    9:16 Portrait / Reel
                  </button>
                </div>

                <button
                  onClick={handleGenerateVideo}
                  disabled={videoLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  {videoLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  <span>Generate Veo Video Clip</span>
                </button>

                {generatedVideoUrl && (
                  <div className="space-y-2">
                    <video src={generatedVideoUrl} controls autoPlay loop className="w-full h-64 object-cover rounded-xl border border-slate-800" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: Voice Live & Transcription */}
          {activeTab === 'voice' && (
            <div className="space-y-4">
              {/* Microphone Speech to Text */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span>Microphone Voice Transcription (Gemini 3.5 Flash)</span>
                </h3>

                <div className="flex items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Recording Voice</span>
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Stop Recording & Transcribe</span>
                    </button>
                  )}

                  {transcribingLoading && (
                    <span className="text-xs text-amber-400 font-mono flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Transcribing audio...</span>
                    </span>
                  )}
                </div>

                {transcriptText && (
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs text-slate-200 font-mono">
                    <span className="text-[10px] text-amber-400 block font-bold mb-1">Transcript Output:</span>
                    "{transcriptText}"
                  </div>
                )}
              </div>

              {/* Real-Time Live API Conversation Mode */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Real-Time Voice Conversations (Live API - Flash Live)</span>
                </h3>

                <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs">
                    <span className="font-bold text-white block">Interactive Live Assistant</span>
                    <span className="text-[10px] text-slate-400">Model: gemini-3.1-flash-live-preview</span>
                  </div>
                  <button
                    onClick={() => setVoiceLiveActive(!voiceLiveActive)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${voiceLiveActive ? 'bg-rose-600 text-white' : 'bg-emerald-500 text-slate-950'}`}
                  >
                    {voiceLiveActive ? 'End Live Session' : 'Start Live Voice Chat'}
                  </button>
                </div>

                {voiceLiveActive && (
                  <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
                      <Volume2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-emerald-300 block">Live Audio Session Active</span>
                    <p className="text-[11px] text-slate-300">Speak into your microphone for instant real-time low-latency response from Gemini Live API.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: Lyria Music Generation */}
          {activeTab === 'music' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  <span>Lyria 3 AI Music & Audio Score Generation</span>
                </h3>

                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 font-mono">Music Style & Mood Description:</label>
                  <input
                    type="text"
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex gap-3 items-center text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">Track Length:</span>
                  <button
                    onClick={() => setMusicLength('clip')}
                    className={`px-3 py-1 rounded text-xs font-mono border transition ${musicLength === 'clip' ? 'bg-purple-600 text-white font-bold border-purple-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                  >
                    30s Short Clip (Lyria-3-Clip)
                  </button>
                  <button
                    onClick={() => setMusicLength('full')}
                    className={`px-3 py-1 rounded text-xs font-mono border transition ${musicLength === 'full' ? 'bg-purple-600 text-white font-bold border-purple-500' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                  >
                    Full Track (Lyria-3-Pro)
                  </button>
                </div>

                <button
                  onClick={handleGenerateMusic}
                  disabled={musicLoading}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  {musicLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />}
                  <span>Generate Lyria Music Audio</span>
                </button>

                {generatedMusic && (
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-purple-300 block">{generatedMusic.title} ({generatedMusic.duration})</span>
                    <audio src={generatedMusic.audioUrl} controls className="w-full" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
