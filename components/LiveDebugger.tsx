
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import type { LiveServerMessage, Blob as GenAIBlob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/audio';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { MicrophoneSlashIcon } from './icons/MicrophoneSlashIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { useAppContext } from '../context/AppContext';
import * as aiService from '../services/aiService';
import { SparklesIcon } from './icons/SparklesIcon';

type TranscriptEntry = {
    speaker: 'You' | 'Creators Edge AI';
    text: string;
};

type ConnectionStatus = 'disconnected' | 'connecting' | 'live' | 'error';

// This is a crucial helper function from the docs for streaming audio
function createBlob(data: Float32Array): GenAIBlob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export const LiveDebugger: React.FC = () => {
    const { addNotification, registerLiveSessionCleanup, withApiErrorHandling } = useAppContext();
    const transcriptEndRef = useRef<HTMLDivElement>(null);
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    
    // Visualization Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);

    // Device selection state
    const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedAudioInputDevice, setSelectedAudioInputDevice] = useState<string | null>(null);
    const [isDebriefing, setIsDebriefing] = useState(false);
    const [debriefResult, setDebriefResult] = useState<string | null>(null);

    const speakersPlayingRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    let nextStartTime = useRef(0);

    const initAudioContexts = useCallback(() => {
        if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed') {
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        }
        if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
    }, []);

    const closeAudioContexts = useCallback(async () => {
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            await outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
    }, []);

    // Visualization Logic
    const drawVisualizer = useCallback(() => {
        if (!canvasRef.current || !analyserRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!canvas || !ctx || !analyser) return;
            
            animationFrameRef.current = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            // Subtle gradient for bars
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#a78bfa'); // Indigo-400
            gradient.addColorStop(1, '#f472b6'); // Pink-400

            for(let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2; // Scale down height
                
                ctx.fillStyle = gradient;
                // Rounded tops for bars
                ctx.beginPath();
                ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, [2, 2, 0, 0]);
                ctx.fill();

                x += barWidth + 1;
            }
        };

        draw();
    }, []);

    const stopVisualizer = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        // Clear canvas
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, []);


    const stopSession = useCallback(async () => {
        console.log("Stopping live session...");
        setStatus('disconnected');
        // Don't clear error here if it was set by onerror
        setIsMuted(false);
        setTranscript([]);
        speakersPlayingRef.current.forEach(source => source.stop());
        speakersPlayingRef.current.clear();
        nextStartTime.current = 0;
        
        stopVisualizer(); // Stop animation

        if (sessionPromiseRef.current) {
            const session = await sessionPromiseRef.current;
            session.close();
            sessionPromiseRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        
        if (analyserRef.current) {
            analyserRef.current.disconnect();
            analyserRef.current = null;
        }

        await closeAudioContexts();
        console.log("Live session stopped and resources released.");
    }, [closeAudioContexts, stopVisualizer]);

    useEffect(() => {
        // Register cleanup function with AppContext
        registerLiveSessionCleanup(stopSession);
        // Cleanup on component unmount
        return () => {
            stopSession();
            registerLiveSessionCleanup(null);
        };
    }, [registerLiveSessionCleanup, stopSession]);

    // Scroll to end of transcript
    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [transcript]);

    const toggleMute = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = isMuted; // If muted (true), enabled becomes true (unmute).
            });
            setIsMuted(!isMuted);
        }
    };

    const startSession = useCallback(async () => {
        if (status === 'connecting' || status === 'live') return;

        setError(null);
        setTranscript([]);
        setDebriefResult(null);
        setStatus('connecting');
        speakersPlayingRef.current.forEach(source => source.stop());
        speakersPlayingRef.current.clear();
        nextStartTime.current = 0;

        try {
            // Initialize AudioContexts
            initAudioContexts();
            const inputAudioContext = inputAudioContextRef.current!;
            const outputAudioContext = outputAudioContextRef.current!;

            // Setup Analyser for Visualization
            const analyser = inputAudioContext.createAnalyser();
            analyser.fftSize = 256; // Lower FFT size for chunkier, more visible bars
            analyserRef.current = analyser;

            // Ensure contexts are running
            await Promise.all([
                inputAudioContext.state === 'suspended' ? inputAudioContext.resume() : Promise.resolve(),
                outputAudioContext.state === 'suspended' ? outputAudioContext.resume() : Promise.resolve(),
            ]);

            let mediaStream: MediaStream;
            if (selectedAudioInputDevice) {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: { deviceId: selectedAudioInputDevice },
                    video: false,
                });
            } else {
                mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            }
            mediaStreamRef.current = mediaStream;

            const source = inputAudioContext.createMediaStreamSource(mediaStream);
            
            // Connect to Analyser AND ScriptProcessor
            source.connect(analyser); // Connect input to visualizer
            // Also connect source to script processor for sending data to API
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
            
            // Start visualizing immediately
            drawVisualizer();

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        console.debug('Live session opened');
                        setStatus('live');
                        
                        // Start sending audio once connected
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.outputTranscription) {
                            setTranscript(prev => {
                                const newTranscript = [...prev];
                                const lastEntry = newTranscript[newTranscript.length - 1];
                                if (lastEntry && lastEntry.speaker === 'Creators Edge AI') {
                                    lastEntry.text += message.serverContent.outputTranscription.text;
                                } else {
                                    newTranscript.push({ speaker: 'Creators Edge AI', text: message.serverContent.outputTranscription.text });
                                }
                                return newTranscript;
                            });
                        } else if (message.serverContent?.inputTranscription) {
                            setTranscript(prev => {
                                const newTranscript = [...prev];
                                const lastEntry = newTranscript[newTranscript.length - 1];
                                if (lastEntry && lastEntry.speaker === 'You') {
                                    lastEntry.text += message.serverContent.inputTranscription.text;
                                } else {
                                    newTranscript.push({ speaker: 'You', text: message.serverContent.inputTranscription.text });
                                }
                                return newTranscript;
                            });
                        }

                        const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64EncodedAudioString) {
                            nextStartTime.current = Math.max(
                                nextStartTime.current,
                                outputAudioContext.currentTime,
                            );
                            const audioBuffer = await decodeAudioData(
                                decode(base64EncodedAudioString),
                                outputAudioContext,
                                24000,
                                1,
                            );
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContext.destination);
                            source.addEventListener('ended', () => {
                                speakersPlayingRef.current.delete(source);
                            });

                            source.start(nextStartTime.current);
                            nextStartTime.current = nextStartTime.current + audioBuffer.duration;
                            speakersPlayingRef.current.add(source);
                        }

                        const interrupted = message.serverContent?.interrupted;
                        if (interrupted) {
                            console.log('Model interrupted audio playback.');
                            speakersPlayingRef.current.forEach(source => source.stop());
                            speakersPlayingRef.current.clear();
                            nextStartTime.current = 0;
                        }
                    },
                    onerror: (e: any) => {
                        console.error('Live session error:', e);
                        
                        let errorMessage = "Connection failed. Please try again.";
                        
                        if (e instanceof Error) {
                            errorMessage = e.message;
                        } else if (typeof e === 'string') {
                            errorMessage = e;
                        } else if (e instanceof ErrorEvent) {
                             errorMessage = e.message || "Network connection lost.";
                        } else if (e?.type === 'error') {
                             errorMessage = "Unable to connect to Gemini Live API. Please check your network.";
                        } else if (Object.prototype.toString.call(e) === '[object Event]') {
                             errorMessage = "Connection failed. Please check your network or API key.";
                        } else if (e && typeof e === 'object') {
                             errorMessage = e.message || e.error?.message || "Unexpected connection failure.";
                        }

                        setError(`Live session error: ${errorMessage}`);
                        setStatus('error');
                        // Defer stopping to ensure error state renders
                        setTimeout(() => stopSession(), 0);
                    },
                    onclose: (e: CloseEvent) => {
                        console.debug('Live session closed:', e);
                        if (status !== 'error') {
                            setStatus('disconnected');
                        }
                        stopSession();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                    },
                    systemInstruction: 'You are a friendly and helpful customer support agent. Speak concisely.',
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                },
            });
            sessionPromiseRef.current = sessionPromise;
        } catch (err: any) {
            console.error('Failed to start live session:', err);
            let errMsg = 'Failed to start live session.';
            
            if (err instanceof Error) {
                errMsg = err.message;
            } else if (typeof err === 'string') {
                errMsg = err;
            } else if (Object.prototype.toString.call(err) === '[object Event]') {
                errMsg = "Connection to AI service failed immediately.";
            }

            setError(errMsg);
            setStatus('error');
            stopSession();
        }
    }, [status, selectedAudioInputDevice, registerLiveSessionCleanup, initAudioContexts, stopSession, drawVisualizer, isMuted]);


    const getAudioInputDevices = useCallback(async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true, video: false }); // Request permissions
            const devices = await navigator.mediaDevices.enumerateDevices();
            setAudioDevices(devices.filter(device => device.kind === 'audioinput'));
            if (!selectedAudioInputDevice && devices.length > 0) {
                setSelectedAudioInputDevice(devices[0].deviceId);
            }
        } catch (err) {
            console.error('Error enumerating audio devices:', err);
            setError('Could not access microphone. Please ensure permissions are granted.');
        }
    }, [selectedAudioInputDevice]);

    useEffect(() => {
        getAudioInputDevices();
        navigator.mediaDevices.addEventListener('devicechange', getAudioInputDevices);
        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', getAudioInputDevices);
        };
    }, [getAudioInputDevices]);

    const handleDebrief = useCallback(async () => {
        if (transcript.length === 0) {
            addNotification('No transcript to debrief.', 'info');
            return;
        }
        setIsDebriefing(true);
        setDebriefResult(null);
        try {
            const fullTranscript = transcript.map(entry => `${entry.speaker}: ${entry.text}`).join('\n');
            let debriefText = '';
            await withApiErrorHandling(
                (signal: AbortSignal, t: string, onChunk: (chunk: string) => void) => aiService.summarizeLiveSession(signal, t, onChunk),
                fullTranscript,
                (chunk) => {
                    debriefText += chunk;
                    setDebriefResult(debriefText);
                }
            );
            addNotification('Debrief generated successfully!', 'success');
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                addNotification(err.message || 'Failed to generate debrief.', 'error');
            }
        } finally {
            setIsDebriefing(false);
        }
    }, [transcript, addNotification, withApiErrorHandling]);


    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="glass-card p-6 flex flex-col items-center text-center">
                <div className="relative w-48 h-24 flex items-center justify-center">
                    {/* Canvas for visualization */}
                    <canvas 
                        ref={canvasRef} 
                        width="192" 
                        height="96" 
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${status === 'live' ? 'opacity-100' : 'opacity-0'}`}
                    />
                    
                    {/* Fallback Icon State */}
                    <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${status === 'live' ? 'bg-transparent shadow-none' : 'bg-gray-700 shadow-lg'} ${status === 'live' ? 'scale-0' : 'scale-100'}`}>
                         {(status === 'connecting' || isDebriefing) ? (
                            <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-white"></div>
                        ) : (
                            <MicrophoneIcon className="h-10 w-10 text-white" />
                        )}
                    </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mt-4">Live Conversational AI</h2>
                <p className={`text-sm mt-2 font-medium ${status === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
                    {status === 'disconnected' && 'Ready to connect.'}
                    {status === 'connecting' && 'Connecting to AI...'}
                    {status === 'live' && (isMuted ? 'Live Session (Muted)' : 'Live Session Active - Speak now')}
                    {status === 'error' && error}
                </p>

                <div className="mt-4 flex gap-4">
                    {(status === 'disconnected' || status === 'error') ? (
                        <button
                            onClick={startSession}
                            disabled={isDebriefing}
                            className="flex items-center px-6 py-3 bg-indigo-600 text-white font-bold rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-transform active:scale-95"
                        >
                            <MicrophoneIcon className="h-5 w-5 mr-2" />
                            Start Session
                        </button>
                    ) : (
                         <div className="flex gap-4">
                            <button
                                onClick={toggleMute}
                                className={`flex items-center px-4 py-3 font-bold rounded-md transition-colors ${isMuted ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
                                title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
                            >
                                {isMuted ? <MicrophoneSlashIcon className="h-5 w-5 mr-2" /> : <MicrophoneIcon className="h-5 w-5 mr-2" />}
                                {isMuted ? "Unmute" : "Mute"}
                            </button>
                            <button
                                onClick={stopSession}
                                className="flex items-center px-6 py-3 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-transform active:scale-95"
                            >
                                <XCircleIcon className="h-5 w-5 mr-2" />
                                Stop Session
                            </button>
                        </div>
                    )}
                    <button
                        onClick={handleDebrief}
                        disabled={status === 'disconnected' || status === 'connecting' || isDebriefing || transcript.length === 0}
                        className="flex items-center px-6 py-3 bg-white/10 text-white font-bold rounded-md hover:bg-white/20 disabled:opacity-50 transition-transform active:scale-95"
                    >
                        <SparklesIcon className="h-5 w-5 mr-2" />
                        {isDebriefing ? 'Debriefing...' : 'Debrief Session'}
                    </button>
                </div>
                {audioDevices.length > 0 && (
                    <div className="mt-4 text-sm text-gray-300">
                        <label htmlFor="audio-input-device" className="mr-2">Microphone:</label>
                        <select
                            id="audio-input-device"
                            value={selectedAudioInputDevice || ''}
                            onChange={(e) => setSelectedAudioInputDevice(e.target.value)}
                            className="p-1 bg-white/10 rounded-md text-white border border-white/10 focus:ring-indigo-500"
                            disabled={status !== 'disconnected'}
                        >
                            {audioDevices.map(device => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Microphone ${device.deviceId.substring(0, 4)}...`}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="glass-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Transcript</h3>
                <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                    {transcript.length === 0 ? (
                        <p className="text-gray-400 text-center italic">Start a session to see the conversation here...</p>
                    ) : (
                        transcript.map((entry, index) => (
                            <div key={index} className="flex space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <span className={`font-semibold ${entry.speaker === 'You' ? 'text-indigo-400' : 'text-green-400'} flex-shrink-0 min-w-[80px]`}>
                                    {entry.speaker}:
                                </span>
                                <p className="text-gray-200 flex-1">{entry.text}</p>
                            </div>
                        ))
                    )}
                    <div ref={transcriptEndRef} />
                </div>
            </div>

            {debriefResult && (
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-4">AI Debrief</h3>
                    <div className="prose prose-invert max-w-none p-4 bg-black/20 rounded-lg">
                        <p className="whitespace-pre-wrap">{debriefResult}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
