
import React, { createContext, useState, useEffect, useRef, useContext, ReactNode, useCallback, useMemo, FC } from 'react';
import * as aiService from '../services/aiService';
import { api, setAuthToken, removeAuthToken, getAuthToken, getBaseUrl } from '../utils/apiClient';
import {
  AnalysisResult,
  AnalysisHistoryItem,
  PromptHistoryItem,
  User,
  RetirementPlan,
  Notification,
  BrandVoice,
  SocialPlatform,
  MonetizationAssets,
  BrandVoiceScoreAnalysis,
  YouTubePost,
  ProjectAssetType, Project, SuggestedAction, GenerationType, ViralScript, SocialPost,
  AnalysisType,
  SessionState,
  ProjectAsset,
  AppAnalysisType,
  AbortError
} from '../types';
import { UpgradeModal } from '../components/UpgradeModal';
import { WelcomeModal } from '../components/WelcomeModal';
import { useLocalStorage, useSessionStorage } from '../utils/hooks';
import { toolConfig } from '../utils/toolConfig';


// --- Context Definition ---

interface AppContextType {
  // State
  analysisType: AnalysisType;
  selectedFile: File | null;
  selectedFileB: File | null;
  fileUrl: string | null;
  contentInputs: { script: string; description: string; link: string };
  contentInputsB: { script: string; description: string; link: string };
  isUploading: boolean;
  isAnalyzing: boolean;
  isAuthChecking: boolean;
  analysisResult: AnalysisResult | null;
  viralScriptResult: ViralScript | null; // For export hub
  brandVoiceScoreAnalysis: BrandVoiceScoreAnalysis | null;
  uploadProgress: number | null;
  notifications: Notification[];
  improvedContent: string | null;
  isGeneratingImproved: boolean;
  socialPost: SocialPost | null;
  isGeneratingSocialPost: boolean;
  productAd: string | null;
  isGeneratingProductAd: boolean;
  youTubePost: YouTubePost | null;
  isGeneratingYouTubePost: boolean;
  monetizationAssets: MonetizationAssets | null;
  isGeneratingMonetizationAssets: boolean;
  keyTakeaways: string[] | null;
  isGeneratingKeyTakeaways: boolean;
  generatedDescription: string | null;
  isGeneratingDescription: boolean;
  feedbackAudio: { url: string; blob: Blob } | null;
  isGeneratingAudio: boolean;
  scriptAudio: { url: string; blob: Blob } | null;
  setScriptAudio: React.Dispatch<React.SetStateAction<{ url: string; blob: Blob } | null>>;
  isGeneratingScriptAudio: boolean;
  initialGenerationProps: { prompt: string; type: GenerationType, settings?: any, autoStart?: boolean } | null;
  retirementPlan: RetirementPlan | null;
  brandVoice: BrandVoice;
  setBrandVoice: (voice: BrandVoice) => Promise<void>;
  isAuthenticated: boolean;
  currentUser: User | null;
  isHistoryOpen: boolean;
  setIsHistoryOpen: (isOpen: boolean) => void;
  isTourActive: boolean;
  overlayContent: React.ReactNode | null;
  setOverlayContent: (content: React.ReactNode | null) => void;
  highlightedTimeLabel: string | null;
  setHighlightedTimeLabel: (label: string | null) => void;
  speakerARole: 'me' | 'client';
  setSpeakerARole: (role: 'me' | 'client') => void;
  speakerBRole: 'me' | 'client';
  setSpeakerBRole: (role: 'me' | 'client') => void;
  analysisHistory: AnalysisHistoryItem[];
  promptHistory: PromptHistoryItem[];
  setPromptHistory: React.Dispatch<React.SetStateAction<PromptHistoryItem[]>>;
  setContentInputs: React.Dispatch<React.SetStateAction<{ script: string; description: string; link: string }>>;
  setContentInputsB: React.Dispatch<React.SetStateAction<{ script: string; description: string; link: string }>>;
  loadingMessages: string[];
  isExportHubOpen: boolean;
  setIsExportHubOpen: (isOpen: boolean) => void;
  generatedReframedContent: { audience: string; summary: string; } | null;
  isGeneratingReframedContent: boolean;
  isProjectsModalOpen: boolean;
  projects: Project[];
  activeProjectId: string | null;
  saveConfirmation: string;
  sessionState: SessionState;
  suggestedActions: SuggestedAction[] | null;
  abortControllerRef: React.MutableRefObject<AbortController>;
  withApiErrorHandling: <TResult, >(apiCall: (signal: AbortSignal, ...args: any[]) => Promise<TResult>, ...args: any[]) => Promise<TResult>;

  // New Generation-specific states
  generatedImage: string | null;
  setGeneratedImage: React.Dispatch<React.SetStateAction<string | null>>;
  generatedVideo: { url: string, payload: any } | null;
  setGeneratedVideo: React.Dispatch<React.SetStateAction<{ url: string, payload: any } | null>>;
  generatedSpeechUrl: string | null;
  setGeneratedSpeechUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setInitialGenerationProps: React.Dispatch<React.SetStateAction<{ prompt: string; type: GenerationType, settings?: any, autoStart?: boolean } | null>>;


  // Actions
  handleRunSuggestedAction: (action: SuggestedAction) => void;
  updateSessionState: (type: AnalysisType | GenerationType, newInputs: any) => void;
  handleTypeChange: (type: AnalysisType) => void;
  handleLogout: () => void;
  removeNotification: (id: number) => void;
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  handleOnboardingFinish: () => void;
  startTour: () => void;
  handleCancel: (silent?: boolean) => void;
  handleFileSelect: (file: File) => void;
  handleFileSelectB: (file: File) => void;
  handleClearFile: () => void;
  handleClearFileB: () => void;
  handleAnalysisSubmit: () => void;
  setViralScriptResult: (script: ViralScript | null) => void;
  handleScoreBrandVoiceAlignment: (text: string) => Promise<void>;
  handleGenerateImprovedContent: () => Promise<void>;
  handleGenerateSocialPost: (platform: SocialPlatform) => Promise<void>;
  handleGenerateYouTubePost: () => Promise<void>;
  handleGenerateProductAd: () => Promise<void>;
  handleGenerateMonetizationAssets: () => Promise<void>;
  handleGenerateKeyTakeaways: () => Promise<void>;
  handleGenerateDescription: () => Promise<void>;
  handleListenToFeedback: (voice: string, style: string) => Promise<void>;
  handleListenToScript: (script: string, voice: string, style: string) => Promise<void>;
  handleGenerateVideoFromScript: (script: string) => void;
  onInitialPropsConsumed: () => void;
  attemptGeneration: () => boolean;
  onSuccessfulGeneration: () => void;
  handleGenerateRetirementPlan: (inputs: any) => Promise<void>;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignup: (email: string, name: string) => Promise<void>;
  handleGoogleLogin: () => Promise<void>;
  handleGithubLogin: () => Promise<void>;
  handleActivation: (user: User) => void;
  handleSelectFromHistory: (item: AnalysisHistoryItem) => void;
  handleClearAnalysisHistory: () => Promise<void>;
  handleDeleteAnalysisHistoryItem: (timestamp: string) => void;
  handleClearPromptHistory: () => void;
  handleDeletePromptHistoryItem: (timestamp: string) => void;
  handleGenerateReframedContent: (originalSummary: string, targetAudience: string) => Promise<void>;
  handleGenerateThumbnailVariations: (suggestions: string) => void;
  handleProjectsModalToggle: () => void;
  handleCreateProject: (name: string) => void;
  handleSelectProject: (id: string) => void;
  handleSaveAssetToProject: (data: any, type: ProjectAssetType, name: string) => void;
  handleLoadAsset: (asset: ProjectAsset) => void;
  handleDeleteProject: (id: string) => void;
  handleDeleteAsset: (projectId: string, assetId: string) => void;
  registerLiveSessionCleanup: (cleanupFn: (() => void) | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Define and export useAppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

const DEFAULT_BRAND_VOICE: BrandVoice = {
  tones: ['Witty', 'Professional'],
  audience: 'Tech entrepreneurs, early-stage startup founders, and aspiring indie hackers aged 25-40.',
  keywords: 'MRR, SaaS, product-market fit, churn rate',
  example: 'Stop burning cash on features nobody wants. In this video, we\'re breaking down how to find true product-market fit, fast. No fluff, just actionable steps.'
};

const LOADING_MESSAGES = [
  "Warming up the AI's neural networks...",
  "Analyzing sentiment arc and emotional impact...",
  "Evaluating hook effectiveness and clarity scores...",
  "Cross-referencing with brand voice...",
  "Generating actionable insights and coaching tips...",
  "Finalizing your comprehensive report...",
  "Processing media for deeper insights...",
  "Synthesizing complex data into clear takeaways...",
  "Optimizing for maximum engagement...",
  "Crafting compelling narratives...",
];

// Define the core async logic of the API error handler outside the component
async function executeApiCallWithErrorHandling<TResult>(
  signal: AbortSignal,
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void,
  handleCancel: (silent?: boolean) => void,
  apiCall: (signal: AbortSignal, ...args: any[]) => Promise<TResult>,
  ...args: any[]
): Promise<TResult> {
  try {
    const result = await apiCall(signal, ...args);
    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('API call aborted:', error.message);
      throw error;
    }
    console.error('API call failed:', error);
    addNotification(error.message || 'An unexpected API error occurred.', 'error');
    handleCancel();
    throw error;
  }
}

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const MAX_FREE_GENERATIONS = 5;

  // UI State
  const [analysisType, setAnalysisType] = useLocalStorage<AnalysisType>('analysisType', 'home');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileB, setSelectedFileB] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [viralScriptResult, setViralScriptResult] = useState<ViralScript | null>(null);
  const [brandVoiceScoreAnalysis, setBrandVoiceScoreAnalysis] = useState<BrandVoiceScoreAnalysis | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('hasCompletedOnboarding', false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [overlayContent, setOverlayContent] = useState<React.ReactNode | null>(null);
  const [highlightedTimeLabel, setHighlightedTimeLabel] = useState<string | null>(null);
  const [speakerARole, setSpeakerARole] = useLocalStorage<'me' | 'client'>('speakerARole', 'me');
  const [speakerBRole, setSpeakerBRole] = useLocalStorage<'me' | 'client'>('speakerBRole', 'client');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const notificationIdCounter = useRef(0);
  const [loadingMessages] = useState<string[]>(LOADING_MESSAGES);
  const [isExportHubOpen, setIsExportHubOpen] = useState(false);
  const [saveConfirmation, setSaveConfirmation] = useState('');
  const [suggestedActions, setSuggestedActions] = useState<SuggestedAction[] | null>(null);
  // State for content inputs
  const [contentInputs, setContentInputs] = useState<{ script: string; description: string; link: string }>({ script: '', description: '', link: '' });
  const [contentInputsB, setContentInputsB] = useState<{ script: string; description: string; link: string }>({ script: '', description: '', link: '' });

  // Ref for LiveDebugger cleanup function
  const liveSessionCleanupRef = useRef<(() => void) | null>(null);

  // Auth & Data State (local cache, single source of truth is backend)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [brandVoice, setBrandVoiceState] = useLocalStorage<BrandVoice>('brandVoice', DEFAULT_BRAND_VOICE); // Renamed internal setter
  const [analysisHistory, setAnalysisHistory] = useLocalStorage<AnalysisHistoryItem[]>('analysisHistory', []);
  const [promptHistory, setPromptHistory] = useLocalStorage<PromptHistoryItem[]>('promptHistory', []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useLocalStorage<string | null>('activeProjectId', null);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);

  const isAuthenticated = !!currentUser;

  // Global AbortController for all cancellable operations
  const abortControllerRef = useRef(new AbortController());

  // --- Init Authentication & Data ---
  useEffect(() => {
    const init = async () => {
      // Check for token in URL (Social Login Callback)
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        setAuthToken(urlToken);
        // Remove token from URL to clean up
        window.history.replaceState({}, document.title, window.location.pathname);

        // Immediately fetch user
        try {
          const { user } = await api.auth.getMe();
          setCurrentUser(user);
        } catch (error) {
          console.error("Failed to fetch user with new token:", error);
          removeAuthToken();
        }
      }

      // Check for payment callback
      const paymentStatus = params.get('payment');
      const txRef = params.get('tx_ref');
      const transactionId = params.get('transaction_id');

      if (paymentStatus === 'success' && (transactionId || txRef)) {
        try {
          await api.payment.verify('flutterwave', transactionId || txRef || ''); // Prefer transaction_id
          addNotification('Payment verified! You are now a Pro member.', 'success');
          // Refresh user if token exists (it should, or check/login logic handles it)
        } catch (e) {
          console.error("Payment verify failed", e);
          addNotification('Payment verification failed.', 'error');
        }
        // Remove params
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const token = getAuthToken();
      if (token) {
        try {
          const { user } = await api.auth.getMe();
          setCurrentUser(user);

          try {
            const userProjects = await api.projects.list();
            setProjects(userProjects);
            // Auto-select project if one exists and none is active
            if (userProjects.length > 0 && (!activeProjectId || !userProjects.find((p: Project) => p.id === activeProjectId))) {
              setActiveProjectId(userProjects[0].id);
            }
          } catch (pErr) {
            console.error("Failed to load projects:", pErr);
          }

        } catch (error) {
          console.error("Auth check failed:", error);
          removeAuthToken();
          setCurrentUser(null);
        }
      }
      setIsAuthChecking(false);
    };
    init();
  }, []);

  // Smart Session: Load state when tab changes
  const [sessionState, setSessionState] = useSessionStorage<SessionState>('appSessionState', {});
  useEffect(() => {
    // Initial load from session storage
    if (sessionState && sessionState[analysisType]) {
      const savedInputs = sessionState[analysisType]!;
      setContentInputs(prev => ({
        ...prev,
        script: savedInputs.script || '',
        description: savedInputs.description || '',
        link: savedInputs.link || ''
      }));
      setContentInputsB(prev => ({
        ...prev,
        script: savedInputs.scriptB || '',
        description: savedInputs.descriptionB || '',
        link: savedInputs.linkB || ''
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisType, setContentInputs, setContentInputsB]); // Removed sessionState to prevent loop

  // Smart Session: Update session state when inputs change
  const updateSessionState = useCallback((type: AnalysisType | GenerationType, newInputs: any) => {
    setSessionState(prev => {
      const currentSlice = prev[type] || {};
      let hasChanged = false;
      for (const key in newInputs) {
        if (Object.prototype.hasOwnProperty.call(newInputs, key) && newInputs[key] !== currentSlice[key]) {
          hasChanged = true;
          break;
        }
      }
      if (!hasChanged) {
        return prev;
      }
      return {
        ...prev,
        [type]: {
          ...currentSlice,
          ...newInputs,
        },
      };
    });
  }, [setSessionState]);

  // Sync contentInputs with sessionState for current analysisType
  useEffect(() => {
    updateSessionState(analysisType, {
      script: contentInputs.script,
      description: contentInputs.description,
      link: contentInputs.link,
      scriptB: contentInputsB.script,
      descriptionB: contentInputsB.description,
      linkB: contentInputsB.link,
    });
  }, [analysisType, contentInputs, contentInputsB, updateSessionState]);


  // Generation State
  const [improvedContent, setImprovedContent] = useState<string | null>(null);
  const [isGeneratingImproved, setIsGeneratingImproved] = useState(false);
  const [socialPost, setSocialPost] = useState<SocialPost | null>(null);
  const [isGeneratingSocialPost, setIsGeneratingSocialPost] = useState(false);
  const [productAd, setProductAd] = useState<string | null>(null);
  const [isGeneratingProductAd, setIsGeneratingProductAd] = useState(false);
  const [youTubePost, setYouTubePost] = useState<YouTubePost | null>(null);
  const [isGeneratingYouTubePost, setIsGeneratingYouTubePost] = useState(false);
  const [monetizationAssets, setMonetizationAssets] = useState<MonetizationAssets | null>(null);
  const [isGeneratingMonetizationAssets, setIsGeneratingMonetizationAssets] = useState(false);
  const [keyTakeaways, setKeyTakeaways] = useState<string[] | null>(null);
  const [isGeneratingKeyTakeaways, setIsGeneratingKeyTakeaways] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [feedbackAudio, setFeedbackAudio] = useState<{ url: string; blob: Blob } | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [scriptAudio, setScriptAudio] = useState<{ url: string; blob: Blob } | null>(null);
  const [isGeneratingScriptAudio, setIsGeneratingScriptAudio] = useState(false);
  const [initialGenerationProps, setInitialGenerationProps] = useState<{ prompt: string; type: GenerationType, settings?: any, autoStart?: boolean } | null>(null);
  const [retirementPlan, setRetirementPlan] = useState<RetirementPlan | null>(null);
  const [generationCount, setGenerationCount] = useLocalStorage('generationCount', 0);
  const [generatedReframedContent, setGeneratedReframedContent] = useState<{ audience: string; summary: string; } | null>(null);
  const [isGeneratingReframedContent, setIsGeneratingReframedContent] = useState(false);
  // States specific to GenerationView that need to be cleared
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<{ url: string, payload: any } | null>(null);
  const [generatedSpeechUrl, setGeneratedSpeechUrl] = useState<string | null>(null);

  // --- Suggested Actions Logic ---
  useEffect(() => {
    if (!analysisResult) {
      setSuggestedActions(null);
      return;
    }

    const actions: SuggestedAction[] = [];
    const { videoAnalysis, salesCallAnalysis, documentAnalysis } = analysisResult;

    if (videoAnalysis) {
      if (videoAnalysis.hookQuality && videoAnalysis.hookQuality.score < 7) {
        actions.push({
          label: "Brainstorm 3 stronger hooks",
          action: 'brainstorm_hooks',
        });
      }
      if (videoAnalysis.ctaEffectiveness && videoAnalysis.ctaEffectiveness.score < 7) {
        actions.push({
          label: "Refine your Call-to-Action",
          action: 'refine_cta',
        });
      }
    }

    if (salesCallAnalysis) {
      const viralMoment = analysisResult.transcript?.find(t => t.tags?.includes('Viral Moment'));
      if (viralMoment) {
        actions.push({
          label: "Turn 'Viral Moment' into a short-form script",
          action: 'generate_script',
          payload: { prompt: `Create a short, punchy video script based on this key moment from a sales call: "${viralMoment.text}"` }
        });
      }
    }

    if (videoAnalysis || documentAnalysis) {
      actions.push({
        label: "Repurpose this content",
        action: 'repurpose',
      });
    }

    setSuggestedActions(actions);
  }, [analysisResult, setSuggestedActions]);


  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = notificationIdCounter.current++;
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleCancel = useCallback((silent: boolean = false) => {
    console.log('Cancelling all active operations...');
    abortControllerRef.current.abort(); // Abort the current controller
    abortControllerRef.current = new AbortController(); // Create a new controller for subsequent operations

    // Reset all loading states
    setIsUploading(false);
    setIsAnalyzing(false);
    setUploadProgress(null);
    setIsGeneratingImproved(false);
    setIsGeneratingSocialPost(false);
    setIsGeneratingProductAd(false);
    setIsGeneratingYouTubePost(false);
    setIsGeneratingMonetizationAssets(false);
    setIsGeneratingKeyTakeaways(false);
    setIsGeneratingDescription(false);
    setIsGeneratingAudio(false);
    setIsGeneratingScriptAudio(false);
    setIsGeneratingReframedContent(false);

    // Call specific cleanup for LiveSession if it exists
    if (liveSessionCleanupRef.current) {
      liveSessionCleanupRef.current();
      liveSessionCleanupRef.current = null; // Clear the ref after cleanup
    }

    if (!silent) {
      addNotification('Operation cancelled.', 'info');
    }
  }, [addNotification]);

  const withApiErrorHandling = useCallback(
    async <TResult,>(
      apiCall: (signal: AbortSignal, ...callArgs: any[]) => Promise<TResult>,
      ...callArgs: any[]
    ): Promise<TResult> => {
      const signal = abortControllerRef.current.signal;
      // Call the external async helper function, awaiting its result
      return await executeApiCallWithErrorHandling<TResult>(signal, addNotification, handleCancel, apiCall, ...callArgs);
    },
    [addNotification, handleCancel, abortControllerRef]
  );


  const handleFileSelect = useCallback((file: File) => {
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      addNotification('File size exceeds 50MB limit.', 'error');
      return;
    }
    setSelectedFile(file);
    setFileUrl(URL.createObjectURL(file));
    // Clear text inputs if a file is selected for relevant types
    if (['salesCall', 'socialMedia', 'productAd', 'documentAnalysis', 'financialReport'].includes(analysisType)) {
      setContentInputs(prev => ({ ...prev, script: '' }));
    }
  }, [addNotification, analysisType, setContentInputs]);

  const handleFileSelectB = useCallback((file: File) => {
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      addNotification('File size exceeds 50MB limit.', 'error');
      return;
    }
    setSelectedFileB(file);
    // Clear text inputs if a file is selected for relevant types
    if (['abTest'].includes(analysisType)) {
      setContentInputsB(prev => ({ ...prev, script: '' }));
    }
  }, [addNotification, analysisType, setContentInputsB]);

  const handleClearFile = useCallback(() => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setSelectedFile(null);
    setFileUrl(null);
  }, [fileUrl]);

  const handleClearFileB = useCallback(() => {
    setSelectedFileB(null);
  }, []);

  const clearResults = useCallback(() => {
    setAnalysisResult(null);
    setImprovedContent(null);
    setSocialPost(null);
    setProductAd(null);
    setYouTubePost(null);
    setMonetizationAssets(null);
    setKeyTakeaways(null);
    setGeneratedDescription(null);
    if (feedbackAudio?.url) URL.revokeObjectURL(feedbackAudio.url);
    setFeedbackAudio(null);
    if (scriptAudio?.url) URL.revokeObjectURL(scriptAudio.url);
    setScriptAudio(null);
    setRetirementPlan(null);
    setBrandVoiceScoreAnalysis(null);
    setGeneratedReframedContent(null);
    setSuggestedActions(null); // Clear suggested actions on new analysis

    // --- NEW: Clear generation-specific results ---
    setViralScriptResult(null);
    setGeneratedImage(null); // No URL.revokeObjectURL needed for data URLs
    if (generatedVideo?.url) URL.revokeObjectURL(generatedVideo.url); // Revoke object URL for video
    setGeneratedVideo(null);
    if (generatedSpeechUrl) URL.revokeObjectURL(generatedSpeechUrl); // Revoke object URL for speech
    setGeneratedSpeechUrl(null);
    // --- END NEW ---

  }, [
    feedbackAudio, scriptAudio, generatedVideo, generatedSpeechUrl
  ]);

  const handleTypeChange = useCallback((type: AnalysisType) => {
    // Abort any ongoing operations silently
    handleCancel(true);

    // Clear any existing analysis results and generation states when switching views
    clearResults();

    // Clear content inputs for the new view, but restore from session storage after type change
    setContentInputs({ script: '', description: '', 'link': '' });
    setContentInputsB({ script: '', description: '', 'link': '' });

    setSelectedFile(null);
    setFileUrl(null);
    setSelectedFileB(null);

    // Clear any overlay content that might be blocking the UI (e.g., WelcomeModal, UpgradeModal)
    setOverlayContent(null);

    setAnalysisType(type); // Finally set the new analysis type
  }, [handleCancel, clearResults]);


  // --- Authentication ---
  const handleLogin = useCallback(async (email: string, password: string) => {
    try {
      const { token, user } = await api.auth.login(email, password);
      setAuthToken(token);
      setCurrentUser(user);
      addNotification('Logged in successfully!', 'success');
      // Fetch projects
      try {
        const userProjects = await api.projects.list();
        setProjects(userProjects);
        if (userProjects.length > 0) {
          setActiveProjectId(userProjects[0].id);
        }
      } catch (pErr) {
        console.error("Failed to fetch projects on login", pErr);
      }
    } catch (error: any) {
      addNotification(error.message || 'Login failed', 'error');
    }
  }, [addNotification]);

  const handleSignup = useCallback(async (email: string, name: string) => {
    try {
      // Use a placeholder password for now
      const { token, user } = await api.auth.signup(email, 'password123', name);
      setAuthToken(token);
      setCurrentUser(user);
      addNotification('Account created successfully!', 'success');
      // New user will have a default project created by backend
      try {
        const userProjects = await api.projects.list();
        setProjects(userProjects);
        if (userProjects.length > 0) {
          setActiveProjectId(userProjects[0].id);
        }
      } catch (e) { console.error("Failed to fetch initial project", e); }
    } catch (error: any) {
      addNotification(error.message || 'Signup failed', 'error');
    }
  }, [addNotification]);

  const handleGoogleLogin = useCallback(async () => {
    window.location.href = `${getBaseUrl()}/auth/google`;
  }, []);

  const handleGithubLogin = useCallback(async () => {
    window.location.href = `${getBaseUrl()}/auth/github`;
  }, []);

  const handleActivation = useCallback((user: User) => {
    setCurrentUser({ ...user, activated: true });
    addNotification('Account activated! Welcome!', 'success');
  }, [addNotification]);

  const handleLogout = useCallback(() => {
    removeAuthToken();
    setCurrentUser(null);
    setProjects([]);
    setActiveProjectId(null);
    addNotification('Logged out successfully.', 'info');
    handleCancel(true); // Clear any ongoing operations silently
    clearResults(); // Clear any displayed results
    setAnalysisType('home'); // Reset to home view
  }, [addNotification, handleCancel, clearResults]);

  // --- Onboarding & Tour ---
  const startTour = useCallback(() => {
    setOverlayContent(null);
    setIsTourActive(true);
  }, []);

  const handleOnboardingFinish = useCallback(() => {
    setIsTourActive(false);
    setHasCompletedOnboarding(true);
    setOverlayContent(null);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !hasCompletedOnboarding && !isTourActive) {
      setOverlayContent(<WelcomeModal onStartTour={startTour} onSkip={handleOnboardingFinish} />);
    }
  }, [isAuthenticated, hasCompletedOnboarding, isTourActive, startTour, handleOnboardingFinish]);


  // --- API Usage & Limits ---
  const incrementGenerationCount = useCallback(() => {
    setGenerationCount(prev => prev + 1);
  }, []);

  const attemptGeneration = useCallback(() => {
    // Owner role bypasses limits
    if (currentUser?.role === 'owner') return true;

    if (currentUser?.plan === 'Free' && generationCount >= MAX_FREE_GENERATIONS) {
      setOverlayContent(<UpgradeModal isOpen={true} onClose={() => setOverlayContent(null)} onUpgrade={() => { setAnalysisType('pricing'); setOverlayContent(null); }} />);
      return false;
    }
    return true;
  }, [currentUser, generationCount]);

  const onSuccessfulGeneration = useCallback(() => {
    incrementGenerationCount();
    addNotification('Generation successful!', 'success');
  }, [incrementGenerationCount, addNotification]);

  // --- Core Analysis Logic ---
  const handleAnalysisSubmit = useCallback(async () => {
    if (!attemptGeneration()) return; // Check limits

    clearResults(); // Clear previous results
    setIsAnalyzing(true);
    setUploadProgress(0); // Reset progress for new upload/analysis

    const currentAnalysisType: AnalysisType = analysisType;

    const fileToUpload = selectedFile;
    const fileToUploadB = selectedFileB;
    const scriptText = contentInputs.script.trim();
    const descriptionText = contentInputs.description.trim();
    const linkText = contentInputs.link.trim();
    const scriptTextB = contentInputsB.script.trim();

    if (!fileToUpload && scriptText === '' && currentAnalysisType !== 'retirementPlanner') {
      addNotification('Please provide a file or paste content for analysis.', 'error');
      setIsAnalyzing(false);
      return;
    }
    if (currentAnalysisType === 'abTest' && !((fileToUpload || scriptText) && (fileToUploadB || scriptTextB))) {
      addNotification('Please provide content for both A and B for A/B testing.', 'error');
      setIsAnalyzing(false);
      return;
    }

    try {
      let result: AnalysisResult | null = null;
      switch (currentAnalysisType) {
        case 'salesCall':
          result = await withApiErrorHandling(aiService.analyzeSalesCall, scriptText, brandVoice, fileToUpload);
          break;
        case 'socialMedia':
          result = await withApiErrorHandling(aiService.analyzeSocialMediaContent, scriptText, descriptionText, linkText, brandVoice, fileToUpload);
          break;
        case 'productAd':
          result = await withApiErrorHandling(aiService.analyzeProductAd, scriptText, descriptionText, linkText, brandVoice, fileToUpload);
          break;
        case 'videoAnalysis':
          if (!fileToUpload) throw new Error('Video file is required for Video Analysis.');
          result = await withApiErrorHandling(aiService.analyzeVideoContent, fileToUpload);
          break;
        case 'transcription':
          if (!fileToUpload) throw new Error('Audio/Video file is required for Transcription.');
          result = await withApiErrorHandling(aiService.transcribeMedia, fileToUpload);
          break;
        case 'documentAnalysis':
          result = await withApiErrorHandling(aiService.analyzeDocument, scriptText, descriptionText, fileToUpload);
          break;
        case 'financialReport':
          result = await withApiErrorHandling(aiService.analyzeFinancialReport, scriptText, descriptionText, fileToUpload);
          break;
        case 'liveStream':
          if (!fileToUpload) throw new Error('Video file is required for Live Stream Analysis.');
          result = await withApiErrorHandling(aiService.analyzeLiveStream, fileToUpload);
          break;
        case 'abTest':
          result = await withApiErrorHandling(aiService.analyzeABTest,
            { script: scriptText, file: fileToUpload },
            { script: scriptTextB, file: fileToUploadB }
          );
          break;
        case 'brandVoiceScore':
          if (!scriptText) throw new Error('Text is required to score brand voice alignment.');
          result = await withApiErrorHandling(aiService.scoreBrandVoiceAlignment, scriptText, brandVoice);
          break;
        case 'repurposeContent':
          result = await withApiErrorHandling(aiService.analyzeAndRepurposeContent, scriptText, fileToUpload);
          break;
        case 'thumbnailAnalysis':
          if (!fileToUpload) throw new Error('Image file is required for Thumbnail Analysis.');
          result = await withApiErrorHandling(aiService.analyzeThumbnail, fileToUpload);
          break;
        default:
          addNotification('Selected analysis type is not yet implemented.', 'info');
          break;
      }

      if (result) {
        setAnalysisResult(result);
        const historyItem: AnalysisHistoryItem = {
          result,
          // FIX: Add type assertion to satisfy AnalysisHistoryItem['analysisType']
          analysisType: currentAnalysisType as AppAnalysisType,
          timestamp: new Date().toISOString(),
          fileName: selectedFile?.name,
          fileNameB: selectedFileB?.name,
        };
        setAnalysisHistory(prev => [historyItem, ...prev.slice(0, 99)]); // Keep last 100
        onSuccessfulGeneration();
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') { // Only show error notification if not aborted
        addNotification(error.message || 'Analysis failed. Please try again.', 'error');
      }
      // Revert to initial state for inputs
      setContentInputs({ script: '', description: '', link: '' });
      setContentInputsB({ script: '', description: '', link: '' });
      setSelectedFile(null);
      setFileUrl(null);
      setSelectedFileB(null);
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(null);
    }
  }, [attemptGeneration, clearResults, analysisType, selectedFile, selectedFileB, contentInputs, contentInputsB, addNotification, withApiErrorHandling, brandVoice, onSuccessfulGeneration]);

  // --- Generation Actions ---
  const handleScoreBrandVoiceAlignment = useCallback(async (text: string) => {
    if (!attemptGeneration()) return;
    setIsAnalyzing(true);
    setBrandVoiceScoreAnalysis(null);
    try {
      const result = await withApiErrorHandling(aiService.scoreBrandVoiceAlignment, text, brandVoice);
      setBrandVoiceScoreAnalysis(result.brandVoiceScoreAnalysis || null);
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to score brand voice alignment.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  }, [attemptGeneration, addNotification, withApiErrorHandling, brandVoice, onSuccessfulGeneration]);

  const handleGenerateImprovedContent = useCallback(async () => {
    if (!analysisResult || !analysisResult.feedbackCard || !attemptGeneration()) return;
    setIsGeneratingImproved(true);
    setImprovedContent(''); // Clear previous content and show loading
    try {
      let improvedContentText = '';
      await withApiErrorHandling(aiService.generateImprovedContent, analysisResult, brandVoice, (chunk: string) => {
        improvedContentText += chunk;
        setImprovedContent(improvedContentText);
      });
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate improved content.', 'error');
    } finally {
      setIsGeneratingImproved(false);
    }
  }, [analysisResult, brandVoice, attemptGeneration, addNotification, withApiErrorHandling, onSuccessfulGeneration]);

  const handleGenerateSocialPost = useCallback(async (platform: SocialPlatform) => {
    if (!analysisResult || !attemptGeneration()) return;
    setIsGeneratingSocialPost(true);
    setSocialPost(null); // Clear previous and show loading
    try {
      let postContent = '';
      await withApiErrorHandling(aiService.generateSocialPost, analysisResult, platform, (chunk: string) => {
        postContent += chunk;
        setSocialPost({ platform, content: postContent });
      });
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate social post.', 'error');
    } finally {
      setIsGeneratingSocialPost(false);
    }
  }, [analysisResult, attemptGeneration, addNotification, withApiErrorHandling, onSuccessfulGeneration]);

  const handleGenerateYouTubePost = useCallback(async () => {
    if (!analysisResult || !attemptGeneration()) return;
    setIsGeneratingYouTubePost(true);
    setYouTubePost(null);
    try {
      const post = await withApiErrorHandling(aiService.generateYouTubePost, analysisResult, brandVoice);
      setYouTubePost(post);
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate YouTube post.', 'error');
    } finally {
      setIsGeneratingYouTubePost(false);
    }
  }, [analysisResult, attemptGeneration, addNotification, withApiErrorHandling, brandVoice, onSuccessfulGeneration]);

  const handleGenerateProductAd = useCallback(async () => {
    if (!analysisResult || !attemptGeneration()) return;
    setIsGeneratingProductAd(true);
    setProductAd(''); // Clear previous and show loading
    try {
      let adContent = '';
      await withApiErrorHandling(aiService.generateProductAd, analysisResult, (chunk: string) => {
        adContent += chunk;
        setProductAd(adContent);
      });
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate product ad.', 'error');
    } finally {
      setIsGeneratingProductAd(false);
    }
  }, [analysisResult, attemptGeneration, addNotification, withApiErrorHandling, onSuccessfulGeneration]);

  const handleGenerateMonetizationAssets = useCallback(async () => {
    if (!analysisResult || !attemptGeneration()) return;
    setIsGeneratingMonetizationAssets(true);
    setMonetizationAssets(null); // Clear previous and show loading
    try {
      const assets = await withApiErrorHandling(aiService.generateMonetizationAssets, analysisResult, brandVoice);
      setMonetizationAssets(assets);
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate monetization assets.', 'error');
    } finally {
      setIsGeneratingMonetizationAssets(false);
    }
  }, [analysisResult, brandVoice, attemptGeneration, addNotification, withApiErrorHandling, onSuccessfulGeneration]);

  const handleGenerateKeyTakeaways = useCallback(async () => {
    if (!analysisResult || !attemptGeneration()) return;
    setIsGeneratingKeyTakeaways(true);
    setKeyTakeaways(null); // Clear previous and show loading
    try {
      const takeaways = await withApiErrorHandling(aiService.generateKeyTakeaways, analysisResult);
      setKeyTakeaways(takeaways);
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate key takeaways.', 'error');
    } finally {
      setIsGeneratingKeyTakeaways(false);
    }
  }, [analysisResult, attemptGeneration, addNotification, withApiErrorHandling, onSuccessfulGeneration]);

  const handleGenerateDescription = useCallback(async () => {
    if (!analysisResult || !attemptGeneration()) return;
    setIsGeneratingDescription(true);
    setGeneratedDescription(''); // Clear previous and show loading
    try {
      let descriptionContent = '';
      await withApiErrorHandling(aiService.generateDescription, analysisResult, brandVoice, (chunk: string) => {
        descriptionContent += chunk;
        setGeneratedDescription(descriptionContent);
      });
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate description.', 'error');
    } finally {
      setIsGeneratingDescription(false);
    }
  }, [analysisResult, brandVoice, attemptGeneration, addNotification, withApiErrorHandling, onSuccessfulGeneration]);

  const handleListenToFeedback = useCallback(async (voice: string, style: string) => {
    if (!analysisResult?.feedbackCard || !attemptGeneration()) return;
    setIsGeneratingAudio(true);
    if (feedbackAudio?.url) URL.revokeObjectURL(feedbackAudio.url); // Clean up previous audio
    setFeedbackAudio(null);
    try {
      const feedbackText = `Strengths: ${analysisResult.feedbackCard.strengths.join('. ')}. Opportunities: ${analysisResult.feedbackCard.opportunities.join('. ')}.`;
      const audioBlob = await withApiErrorHandling(aiService.generateSpeechFromText, feedbackText, voice, style);
      setFeedbackAudio({ url: URL.createObjectURL(audioBlob), blob: audioBlob });
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate audio feedback.', 'error');
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [analysisResult, attemptGeneration, addNotification, feedbackAudio, withApiErrorHandling, onSuccessfulGeneration]);

  const handleListenToScript = useCallback(async (script: string, voice: string, style: string) => {
    if (!script.trim() || !attemptGeneration()) return;
    setIsGeneratingScriptAudio(true);
    if (scriptAudio?.url) URL.revokeObjectURL(scriptAudio.url);
    setScriptAudio(null);
    try {
      const audioBlob = await withApiErrorHandling(aiService.generateSpeechFromText, script, voice, style);
      setScriptAudio({ url: URL.createObjectURL(audioBlob), blob: audioBlob });
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate audio for script.', 'error');
    } finally {
      setIsGeneratingScriptAudio(false);
    }
  }, [attemptGeneration, addNotification, scriptAudio, withApiErrorHandling, onSuccessfulGeneration]);

  const handleGenerateVideoFromScript = useCallback((script: string) => {
    setInitialGenerationProps({ prompt: script, type: 'video', autoStart: true });
    handleTypeChange('contentGeneration'); // Navigate to Generation tab
  }, [handleTypeChange]);

  const onInitialPropsConsumed = useCallback(() => {
    setInitialGenerationProps(null);
  }, []);

  const handleGenerateRetirementPlan = useCallback(async (inputs: any) => {
    if (!attemptGeneration()) return;
    setIsAnalyzing(true);
    setRetirementPlan(null); // Clear previous plan
    try {
      const plan = await withApiErrorHandling(aiService.generateRetirementPlan, inputs);
      setRetirementPlan(plan);
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to generate retirement plan.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  }, [attemptGeneration, addNotification, withApiErrorHandling, onSuccessfulGeneration]);

  const handleSelectFromHistory = useCallback((item: AnalysisHistoryItem) => {
    handleCancel(true); // Cancel any ongoing operations silently before loading new content
    setAnalysisType(item.analysisType);
    setAnalysisResult(item.result);
    // Restore relevant files/inputs if applicable
    if (item.fileName) {
      // In a real app, you might re-fetch the file or store its content.
      // For this demo, we'll just indicate it was a file analysis.
      addNotification(`Loaded analysis for "${item.fileName}". Media preview might not be available.`, 'info');
    } else {
      // Attempt to restore script if it was a text-based analysis
      const script = item.result.transcript?.map(t => t.text).join('\n') || item.result.documentAnalysis?.summary || '';
      setContentInputs(prev => ({ ...prev, script }));
    }
    setIsHistoryOpen(false);
    setOverlayContent(null);
  }, [handleCancel, addNotification]);

  const handleClearAnalysisHistory = useCallback(async () => {
    if (window.confirm('Are you sure you want to delete all analysis history? This cannot be undone.')) {
      setAnalysisHistory([]);
      addNotification('Analysis history cleared.', 'info');
    }
  }, [addNotification]);

  const handleDeleteAnalysisHistoryItem = useCallback((timestamp: string) => {
    setAnalysisHistory(prev => prev.filter(item => item.timestamp !== timestamp));
    addNotification('Analysis item deleted.', 'info');
  }, [addNotification]);

  const handleClearPromptHistory = useCallback(() => {
    if (window.confirm('Are you sure you want to delete all prompt history? This cannot be undone.')) {
      setPromptHistory([]);
      addNotification('Prompt history cleared.', 'info');
    }
  }, [addNotification]);

  const handleDeletePromptHistoryItem = useCallback((timestamp: string) => {
    setPromptHistory(prev => prev.filter(item => item.timestamp !== timestamp));
    addNotification('Prompt item deleted.', 'info');
  }, [addNotification]);

  const handleGenerateReframedContent = useCallback(async (originalSummary: string, targetAudience: string) => {
    if (!originalSummary.trim() || !targetAudience.trim() || !attemptGeneration()) return;
    setIsGeneratingReframedContent(true);
    setGeneratedReframedContent(null);
    try {
      const prompt = `Reframe the following summary for the target audience: "${targetAudience}".\n\nOriginal Summary:\n${originalSummary}`;
      const reframedSummary = await withApiErrorHandling(aiService.refineTranscriptLine, originalSummary, prompt); // Reusing refine for simplicity
      setGeneratedReframedContent({ audience: targetAudience, summary: reframedSummary });
      onSuccessfulGeneration();
    } catch (error: any) {
      if (error.name !== 'AbortError') addNotification(error.message || 'Failed to reframe content.', 'error');
    } finally {
      setIsGeneratingReframedContent(false);
    }
  }, [attemptGeneration, addNotification, withApiErrorHandling, onSuccessfulGeneration]);

  const handleGenerateThumbnailVariations = useCallback((suggestions: string) => {
    setInitialGenerationProps({ prompt: `Generate several creative and high-impact thumbnail variations based on these suggestions: ${suggestions}`, type: 'image' });
    handleTypeChange('contentGeneration');
  }, [handleTypeChange]);

  const handleProjectsModalToggle = useCallback(() => {
    setIsProjectsModalOpen(prev => !prev);
  }, []);

  const handleCreateProject = useCallback(async (name: string) => {
    try {
      const newProject = await api.projects.create(name);
      setProjects(prev => [newProject, ...prev]);
      setActiveProjectId(newProject.id);
      addNotification(`Project "${name}" created and set as active.`, 'success');
    } catch (error: any) {
      addNotification(error.message || 'Failed to create project', 'error');
    }
  }, [addNotification]);

  const handleSelectProject = useCallback((id: string) => {
    setActiveProjectId(id);
    addNotification(`Project set to active.`, 'info');
  }, [addNotification]);

  const handleSaveAssetToProject = useCallback(async (data: any, type: ProjectAssetType, name: string) => {
    let targetProjectId = activeProjectId;

    // Auto-create a "General" project if none is selected
    if (!targetProjectId) {
      try {
        const newProject = await api.projects.create("General");
        setProjects(prev => [newProject, ...prev]);
        targetProjectId = newProject.id;
        setActiveProjectId(targetProjectId);
        addNotification('Created "General" project automatically.', 'info');
      } catch (error: any) {
        addNotification('Failed to create a project to save to.', 'error');
        return;
      }
    }

    try {
      const assetPayload = {
        type,
        name,
        data,
        sourceFile: selectedFile ? { name: selectedFile.name, type: selectedFile.type } : undefined,
        sourceFileB: selectedFileB ? { name: selectedFileB.name, type: selectedFileB.type } : undefined,
      };
      const newAsset = await api.assets.create(targetProjectId, assetPayload);

      setProjects(prevProjects => prevProjects.map(project => {
        if (project.id === targetProjectId) {
          return {
            ...project,
            assets: [newAsset, ...(project.assets || [])],
          };
        }
        return project;
      }));

      setSaveConfirmation(`Saved to ${projects.find(p => p.id === targetProjectId)?.name || 'project'}!`);
      setTimeout(() => setSaveConfirmation(''), 2000);
      addNotification(`Asset "${name}" saved to project.`, 'success');
    } catch (error: any) {
      addNotification(error.message || 'Failed to save asset', 'error');
    }
  }, [activeProjectId, selectedFile, selectedFileB, addNotification, projects]);

  const handleLoadAsset = useCallback((asset: ProjectAsset) => {
    handleCancel(true); // Clear any ongoing operations silently

    // Switch to the correct view first, which will clear previous results via handleTypeChange logic
    if (asset.type in toolConfig) { // If it's an analysis type
      setAnalysisType(asset.type as AnalysisType);
      setTimeout(() => {
        setAnalysisResult(asset.data as AnalysisResult);
      }, 0);
    } else { // If it's a generation type
      handleTypeChange('contentGeneration'); // Navigate to content generation view

      // Use setTimeout to allow render cycle to clear previous state before setting new state
      setTimeout(() => {
        if (asset.type === 'script') {
          setInitialGenerationProps({ prompt: (asset.data as ViralScript).script, type: 'script' });
          setViralScriptResult(asset.data as ViralScript);
        } else if (asset.type === 'image') {
          setInitialGenerationProps({ prompt: asset.name, type: 'image', settings: { imageUrl: asset.data as string } });
          setGeneratedImage(asset.data as string);
        } else if (asset.type === 'video') {
          setInitialGenerationProps({ prompt: asset.name, type: 'video', settings: { videoUrl: asset.data as string } });
          // Reconstruct payload if possible, or provide minimal payload for display
          setGeneratedVideo({ url: asset.data as string, payload: { prompt: asset.name, videoModel: 'unknown' } });
        } else if (asset.type === 'speech') {
          setInitialGenerationProps({ prompt: asset.name, type: 'speech', settings: { speechUrl: asset.data as string } });
          setGeneratedSpeechUrl(asset.data as string);
        }
      }, 0);
    }
    addNotification(`Loaded "${asset.name}" from project.`, 'info');
    setIsProjectsModalOpen(false); // Close modal after loading
  }, [handleCancel, handleTypeChange, addNotification]);

  const handleDeleteProject = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await api.projects.delete(id);
        setProjects(prev => prev.filter(p => p.id !== id));
        if (activeProjectId === id) {
          setActiveProjectId(null);
        }
        addNotification('Project deleted.', 'info');
      } catch (error: any) {
        addNotification(error.message || 'Failed to delete project', 'error');
      }
    }
  }, [activeProjectId, setActiveProjectId, addNotification]);

  const handleDeleteAsset = useCallback(async (projectId: string, assetId: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.assets.delete(projectId, assetId);
        setProjects(prev => prev.map(p => {
          if (p.id === projectId) {
            const currentAssets = Array.isArray(p.assets) ? p.assets : [];
            return { ...p, assets: currentAssets.filter(a => a.id !== assetId) };
          }
          return p;
        }));
        addNotification('Asset deleted.', 'info');
      } catch (error: any) {
        addNotification(error.message || 'Failed to delete asset', 'error');
      }
    }
  }, [addNotification]);

  const registerLiveSessionCleanup = useCallback((cleanupFn: (() => void) | null) => {
    liveSessionCleanupRef.current = cleanupFn;
  }, []);

  const setBrandVoiceWrapped = useCallback(async (voice: BrandVoice): Promise<void> => {
    // Simulate async operation, e.g., API call to save brand voice
    await new Promise(resolve => setTimeout(resolve, 300));
    setBrandVoiceState(voice); // Use the internal setter from useLocalStorage
    return;
  }, [setBrandVoiceState]); // Use the correct setter from useLocalStorage

  // --- Suggested Actions Runner ---
  const handleRunSuggestedAction = useCallback((action: SuggestedAction) => {
    switch (action.action) {
      case 'generate_social':
        handleGenerateSocialPost('X'); // Default to X for now
        break;
      case 'generate_ad':
        handleGenerateProductAd();
        break;
      case 'brainstorm_hooks':
        if (analysisResult?.videoAnalysis?.hookQuality?.critique) {
          setInitialGenerationProps({ prompt: `Brainstorm 3 new video hooks based on this critique: "${analysisResult.videoAnalysis.hookQuality.critique}".`, type: 'script' });
          handleTypeChange('contentGeneration');
        } else {
          addNotification('No specific hook critique found for brainstorming.', 'info');
        }
        break;
      case 'refine_cta':
        if (analysisResult?.videoAnalysis?.ctaEffectiveness?.suggestion) {
          setInitialGenerationProps({ prompt: `Refine this call to action: "${analysisResult.videoAnalysis.ctaEffectiveness.suggestion}". Make it more urgent and benefit-driven.`, type: 'script' });
          handleTypeChange('contentGeneration');
        } else {
          addNotification('No specific CTA suggestion found for refinement.', 'info');
        }
        break;
      case 'repurpose':
        setInitialGenerationProps({ prompt: analysisResult?.transcript?.map(t => t.text).join('\n') || analysisResult?.documentAnalysis?.summary || '', type: 'script' });
        handleTypeChange('repurposeContent');
        break;
      case 'generate_script':
        if (action.payload?.prompt) {
          setInitialGenerationProps({ prompt: action.payload.prompt, type: 'script' });
          handleTypeChange('contentGeneration');
        } else {
          addNotification('No prompt provided for script generation.', 'error');
        }
        break;
      default:
        addNotification(`Action "${action.label}" is not yet implemented.`, 'info');
        break;
    }
  }, [analysisResult, handleGenerateSocialPost, handleGenerateProductAd, addNotification, handleTypeChange]);


  const contextValue = useMemo(() => ({
    // State
    analysisType,
    selectedFile,
    selectedFileB,
    fileUrl,
    isUploading,
    isAnalyzing,
    isAuthChecking,
    analysisResult,
    viralScriptResult,
    brandVoiceScoreAnalysis,
    uploadProgress,
    notifications,
    improvedContent,
    isGeneratingImproved,
    socialPost,
    isGeneratingSocialPost,
    productAd,
    isGeneratingProductAd,
    youTubePost,
    isGeneratingYouTubePost,
    monetizationAssets,
    isGeneratingMonetizationAssets,
    keyTakeaways,
    isGeneratingKeyTakeaways,
    generatedDescription,
    isGeneratingDescription,
    feedbackAudio,
    isGeneratingAudio,
    scriptAudio,
    setScriptAudio, // Added this
    isGeneratingScriptAudio,
    initialGenerationProps,
    retirementPlan,
    brandVoice, // Use aliased state variable
    isAuthenticated,
    currentUser,
    isHistoryOpen,
    isTourActive,
    overlayContent,
    highlightedTimeLabel,
    speakerARole,
    speakerBRole,
    analysisHistory,
    promptHistory,
    contentInputs,
    contentInputsB,
    loadingMessages,
    isExportHubOpen,
    generatedReframedContent,
    isGeneratingReframedContent,
    isProjectsModalOpen,
    projects,
    activeProjectId,
    saveConfirmation,
    sessionState,
    suggestedActions,
    abortControllerRef,
    // Add new generation-specific states:
    generatedImage,
    generatedVideo,
    generatedSpeechUrl,
    setInitialGenerationProps,
    // Actions (including setters from ContextType)
    setBrandVoice: setBrandVoiceWrapped, // Use the wrapped setter
    setIsHistoryOpen,
    setOverlayContent,
    setHighlightedTimeLabel,
    setSpeakerARole,
    setSpeakerBRole,
    setPromptHistory,
    setContentInputs,
    setContentInputsB,
    setIsExportHubOpen,
    setGeneratedImage,
    setGeneratedVideo,
    setGeneratedSpeechUrl,
    setIsProjectsModalOpen,
    withApiErrorHandling,
    handleRunSuggestedAction,
    updateSessionState,
    handleTypeChange,
    handleLogout,
    removeNotification,
    addNotification,
    handleOnboardingFinish,
    startTour,
    handleCancel,
    handleFileSelect,
    handleFileSelectB,
    handleClearFile,
    handleClearFileB,
    handleAnalysisSubmit,
    setViralScriptResult,
    handleScoreBrandVoiceAlignment,
    handleGenerateImprovedContent,
    handleGenerateSocialPost,
    handleGenerateYouTubePost,
    handleGenerateProductAd,
    handleGenerateMonetizationAssets,
    handleGenerateKeyTakeaways,
    handleGenerateDescription,
    handleListenToFeedback,
    handleListenToScript,
    handleGenerateVideoFromScript,
    onInitialPropsConsumed,
    attemptGeneration,
    onSuccessfulGeneration,
    handleGenerateRetirementPlan,
    handleLogin,
    handleSignup,
    handleGoogleLogin,
    handleGithubLogin,
    handleActivation,
    handleSelectFromHistory,
    handleClearAnalysisHistory,
    handleDeleteAnalysisHistoryItem,
    handleClearPromptHistory,
    handleDeletePromptHistoryItem,
    handleGenerateReframedContent,
    handleGenerateThumbnailVariations,
    handleProjectsModalToggle,
    handleCreateProject,
    handleSelectProject,
    handleSaveAssetToProject,
    handleLoadAsset,
    handleDeleteProject,
    handleDeleteAsset,
    registerLiveSessionCleanup
  }), [
    // State dependencies
    analysisType, selectedFile, selectedFileB, fileUrl, isUploading, isAnalyzing, isAuthChecking, analysisResult, viralScriptResult, brandVoiceScoreAnalysis,
    uploadProgress, notifications, improvedContent, isGeneratingImproved, socialPost, isGeneratingSocialPost, productAd, isGeneratingProductAd, youTubePost, isGeneratingYouTubePost, monetizationAssets, isGeneratingMonetizationAssets,
    keyTakeaways, isGeneratingKeyTakeaways, generatedDescription, isGeneratingDescription, feedbackAudio, isGeneratingAudio, scriptAudio, isGeneratingScriptAudio, initialGenerationProps, retirementPlan, brandVoice,
    isAuthenticated, currentUser, isHistoryOpen, isTourActive, overlayContent, highlightedTimeLabel, speakerARole, speakerBRole, analysisHistory, promptHistory, contentInputs, contentInputsB, loadingMessages, isExportHubOpen,
    generatedReframedContent, isGeneratingReframedContent, isProjectsModalOpen, projects, activeProjectId, saveConfirmation, sessionState, suggestedActions,
    // Add new generation-specific states:
    generatedImage, generatedVideo, generatedSpeechUrl,
    // Action dependencies (all memoized callbacks, including the new withApiErrorHandling)
    withApiErrorHandling, handleRunSuggestedAction, updateSessionState, handleTypeChange, handleLogout, removeNotification, addNotification, handleOnboardingFinish, startTour, handleCancel,
    handleFileSelect, handleFileSelectB, handleClearFile, handleClearFileB, handleAnalysisSubmit, setViralScriptResult, handleScoreBrandVoiceAlignment, handleGenerateImprovedContent, handleGenerateSocialPost, handleGenerateYouTubePost, handleGenerateProductAd, handleGenerateMonetizationAssets,
    handleGenerateKeyTakeaways, handleGenerateDescription, handleListenToFeedback, handleListenToScript, handleGenerateVideoFromScript, onInitialPropsConsumed, attemptGeneration, onSuccessfulGeneration, handleGenerateRetirementPlan,
    handleLogin, handleSignup, handleGoogleLogin, handleGithubLogin, handleActivation, handleSelectFromHistory, handleClearAnalysisHistory, handleDeleteAnalysisHistoryItem, handleClearPromptHistory, handleDeletePromptHistoryItem,
    handleGenerateReframedContent, handleGenerateThumbnailVariations, handleProjectsModalToggle, handleCreateProject, handleSelectProject, handleSaveAssetToProject, handleLoadAsset, handleDeleteProject, handleDeleteAsset, registerLiveSessionCleanup,
    setBrandVoiceWrapped,
    setScriptAudio // Added this dependency
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
