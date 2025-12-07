import React, { useEffect, useRef, useState } from 'react';
import { SidebarNav } from './components/SidebarNav';
import { GenerationView } from './components/GenerationView';
import { BrandVoiceSetup } from './components/BrandVoiceSetup';
import { PricingView } from './components/PricingView';
import { AuthView } from './components/AuthView';
import { ActivationView } from './components/ActivationView';
import { AnalysisHistoryModal } from './components/AnalysisHistoryModal';
import { LogoutIcon } from './components/icons/LogoutIcon';
import { HistoryIcon } from './components/icons/HistoryIcon';
import { OnboardingTour } from './components/OnboardingTour';
import { Overlay } from './components/Overlay';
import { RetirementPlanner } from './components/RetirementPlanner';
import { LiveDebugger } from './components/LiveDebugger';
import { NotificationContainer } from './components/Notification';
import { QuestionMarkCircleIcon } from './components/icons/QuestionMarkCircleIcon';
import { AnalysisInput } from './components/AnalysisInput';
import { ABTestInput } from './components/ABTestInput';
import { useAppContext } from './context/AppContext';
import { Loader } from './components/Loader';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { toolConfig } from './utils/toolConfig';
import { EmptyState } from './components/EmptyState';
import { ExportHubModal } from './components/ExportHubModal';
import { BrandVoiceChecker } from './components/BrandVoiceChecker';
import { ProjectsModal } from './components/ProjectsModal';
import { FolderIcon } from './components/icons/FolderIcon';
import { HomeDashboard } from './components/HomeDashboard';
import { ApiKeySetup } from './components/ApiKeySetup';
import { ExportIcon } from './components/icons/ExportIcon';
import { Bars3Icon } from './components/icons/Bars3Icon';
import type { AppAnalysisType } from './types';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';


const ANALYSIS_ONBOARDING_STEPS = [
    { selector: '#analysis-type-selector', title: '1. Choose Your Mission', content: 'Every great piece of content starts with a goal. Select the tool that matches your creative mission, from analyzing a video to perfecting a sales call.', proTip: 'Start with a "Video Analysis" on a past success to understand what worked!' },
    { selector: '#analysis-input-area', title: '2. Feed Your Co-pilot', content: 'Provide your content. You can upload media, paste a script, or add a link. The more context you give the AI, the smarter its insights will be.', proTip: 'For social media posts, adding a link gives the AI crucial context about the platform.' },
    { selector: '#analysis-submit-button', title: '3. Unleash the AI', content: 'This is where the magic happens. Our AI will perform a deep-dive analysis to uncover strengths, weaknesses, and hidden opportunities.', proTip: 'While the AI works, start thinking about the single biggest question you want answered.' },
    { selector: '#analysis-report-area', title: '4. Discover Your Edge', content: 'Your comprehensive report appears here. It\'s more than data—it\'s a roadmap to better content, with scores, graphs, and a full transcript.', proTip: 'Click on any transcript line to instantly jump to that moment in your video or audio.' },
    { selector: '#feedback-card-area', title: '5. Turn Insight into Action', content: 'The AI Coaching Hub is your creative partner. It provides clear feedback and lets you instantly generate improved content, turning analysis into results.', proTip: 'Use the "Generate Social Post" action to immediately promote your content.' },
    { selector: '#user-menu-area', title: '6. Master Your Hub', content: 'Your account menu is command central. Review past work in your History, manage your Brand Voice, and organize everything into Projects.', proTip: 'Set up your "Brand Voice" first for hyper-personalized AI generations.' },
];

const GENERATION_ONBOARDING_STEPS = [
    { selector: '#generation-type-tabs', title: '1. Select Your Canvas', content: 'Choose what you want to create. Each tool is a gateway to a different form of content, from viral scripts to stunning visuals.', proTip: 'Start with the "Viral Script" generator to brainstorm and structure your next big idea.' },
    { selector: '#prompt-textarea', title: '2. Direct Your AI', content: 'This is where your vision takes shape. A great prompt is specific and detailed. Describe not just what you want, but the mood, style, and goal.', proTip: 'Use our "Templates" for inspiration on how to write effective prompts.' },
    { selector: '#generation-controls', title: '3. Fine-Tune the Details', content: 'Each tool has powerful options. Dial in aspect ratios, select AI models, and add reference images to guide the AI with precision.', proTip: 'For videos, uploading a reference image as a starting frame gives you incredible creative control.' },
    { selector: '#generate-button', title: '4. Create the Magic', content: "When you're ready, click here to let the AI bring your vision to life. This can take a moment for complex creations like video.", proTip: 'Long video generations? The AI is working hard! Grab a coffee and get ready to be amazed.' },
    { selector: '#generation-results-panel', title: '5. Your Masterpiece is Ready', content: 'Your generated content appears here. It\'s not just a final product—it\'s a starting point. Download, save, or use it to inspire your next creation.', proTip: 'Use the "Save to Project" button to keep all your generated assets organized.' },
    { selector: '#user-menu-area', title: '6. Manage Your Hub', content: 'Your account menu is command central. Access your generation history, plan details, and brand voice from here.', proTip: 'Regularly review your "History" to reuse and refine your most successful prompts.' },
];

const videoBackgrounds: Partial<Record<AppAnalysisType, string>> = {
  videoAnalysis: "https://videos.pexels.com/video-files/4784414/4784414-hd_1920_1080_25fps.mp4",
  socialMedia: "https://videos.pexels.com/video-files/8051939/8051939-hd_1920_1080_30fps.mp4",
  financialReport: "https://videos.pexels.com/video-files/7578135/7578135-hd_1920_1080_25fps.mp4",
  salesCall: "https://videos.pexels.com/video-files/5990264/5990264-hd_1920_1080_25fps.mp4",
  contentGeneration: "https://videos.pexels.com/video-files/3254013/3254013-hd_1920_1080_25fps.mp4",
  repurposeContent: "https://videos.pexels.com/video-files/5495893/5495893-hd_1920_1080_25fps.mp4",
  thumbnailAnalysis: "https://videos.pexels.com/video-files/4434246/4434246-hd_1920_1080_25fps.mp4",
};

const defaultVideoBackground = "https://videos.pexels.com/video-files/853874/853874-hd_1920_1080_25fps.mp4";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, Creator!";
  if (hour < 18) return "Good afternoon, Creator!";
  return "Good evening, Creator!";
};

export const App: React.FC = () => {
  const {
    // State
    isAuthChecking, // NEW
    analysisType,
    analysisResult,
    isAuthenticated,
    currentUser,
    isUploading,
    isAnalyzing,
    uploadProgress,
    isHistoryOpen,
    isTourActive,
    overlayContent,
    notifications,
    loadingMessages,
    isExportHubOpen,
    projects,
    activeProjectId,
    // Actions
    handleLogout,
    setIsHistoryOpen,
    startTour,
    removeNotification,
    handleCancel,
    setIsExportHubOpen,
    handleProjectsModalToggle,
  } = useAppContext();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    // Reset video state for new source
    videoEl.style.display = 'block';
    videoEl.style.opacity = '0';
    
    const handleCanPlay = () => {
      // Fade in smoothly once data is ready
      videoEl.style.transition = 'opacity 1s ease-in-out';
      videoEl.style.opacity = '0.3';
    };

    const handleError = (e: Event) => {
        // Silently fail to CSS gradient background if video fails
        console.warn("Video background failed to load, falling back to gradient.");
        videoEl.style.display = 'none';
        videoEl.style.opacity = '0';
    };

    videoEl.addEventListener('canplay', handleCanPlay);
    videoEl.addEventListener('error', handleError);

    // Attempt to play
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // Auto-play was prevented or failed
            console.warn("Video autoplay prevented/failed:", error);
            // We don't strictly hide it here, as it might just be paused, 
            // but if it's a loading error, the 'error' event will catch it.
        });
    }

    return () => {
      videoEl.removeEventListener('canplay', handleCanPlay);
      videoEl.removeEventListener('error', handleError);
    };
  }, [analysisType]); 
  
  const analysisInputView = () => {
        const inputTools: AppAnalysisType[] = [
            'videoAnalysis', 'transcription', 'liveStream', 'documentAnalysis', 
            'financialReport', 'socialMedia', 'salesCall', 'productAd',
            'repurposeContent', 'thumbnailAnalysis'
        ];

        const currentTool = toolConfig[analysisType as AppAnalysisType];

        if (inputTools.includes(analysisType as AppAnalysisType)) {
            if (!currentTool) return <div className="bg-red-500/20 text-white p-4 text-center rounded-lg">Configuration missing for {analysisType}</div>;
            return (
                <div id="analysis-input-area" className="w-full max-w-2xl mx-auto">
                    <EmptyState
                        icon={currentTool.icon}
                        title={currentTool.label}
                        description={currentTool.description}
                    >
                        <AnalysisInput />
                    </EmptyState>
                </div>
            );
        }
        if (analysisType === 'abTest') {
             if (!currentTool) return <div className="bg-red-500/20 text-white p-4 text-center rounded-lg">Configuration missing for {analysisType}</div>;
             return (
                 <div id="analysis-input-area" className="w-full max-w-4xl mx-auto">
                    <EmptyState
                        icon={currentTool.icon}
                        title={currentTool.label}
                        description={currentTool.description}
                    >
                        <ABTestInput />
                    </EmptyState>
                </div>
             );
        }
        return null;
    };

  const renderContent = () => {
    // Show loading state while checking auth
    if (isAuthChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader message="Initializing..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
          <div className="flex items-center justify-center min-h-full">
            <AuthView />
          </div>
        );
    }
    if (!currentUser?.activated) {
        return (
          <div className="flex items-center justify-center min-h-full">
            <ActivationView />
          </div>
        );
    }
    
    if (analysisType === 'home') {
        return <HomeDashboard />;
    }
    if (analysisType === 'contentGeneration') {
      return <div id="analysis-input-area" className="w-full"><GenerationView /></div>;
    }
    if (analysisType === 'brandVoice') {
      return (
        <div id="analysis-input-area" className="w-full max-w-lg mx-auto">
          <BrandVoiceSetup />
        </div>
      );
    }
    if (analysisType === 'brandVoiceScore') {
      return (
        <div id="analysis-input-area" className="w-full max-w-lg mx-auto">
          <BrandVoiceChecker />
        </div>
      );
    }
    if (analysisType === 'apiKeys') {
      return <div id="analysis-input-area" className="w-full max-w-lg mx-auto"><ApiKeySetup /></div>;
    }
    if (analysisType === 'pricing') {
      return <div id="analysis-input-area" className="w-full"><PricingView /></div>;
    }
     if (analysisType === 'retirementPlanner') {
      return <div id="analysis-input-area" className="w-full"><RetirementPlanner /></div>;
    }
    if (analysisType === 'liveDebugger') {
        return <div id="analysis-input-area" className="w-full"><LiveDebugger /></div>;
    }

    // Fallback for all other analysis types
    return (
      <div className="w-full">
        {analysisResult ? (
            <Dashboard />
        ) : (
          <div className="flex items-center justify-center min-h-full pt-16">
            {analysisInputView()}
          </div>
        )}
      </div>
    );
  };
  
  const isGenerationView = analysisType === 'contentGeneration';
  const tourSteps = isGenerationView ? GENERATION_ONBOARDING_STEPS : ANALYSIS_ONBOARDING_STEPS;
  
  const currentToolConfig = toolConfig[analysisType as AppAnalysisType];
  const loaderMessage = "Uploading your file...";

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition: Transition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  // Safe access to active project
  const activeProject = Array.isArray(projects) ? projects.find(p => p.id === activeProjectId) : null;

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans flex">
        <video 
            key={analysisType} // Force remount when analysisType changes
            ref={videoRef} 
            autoPlay 
            muted 
            loop 
            playsInline 
            id="bg-video"
            src={videoBackgrounds[analysisType as AppAnalysisType] || defaultVideoBackground}
            style={{ display: 'none', opacity: 0 }} // Start hidden
        >
            Your browser does not support the video tag.
        </video>
        <NotificationContainer notifications={notifications} onDismiss={removeNotification} />
        {(isUploading || isAnalyzing) && (
            <Overlay>
                <Loader 
                    message={isUploading ? loaderMessage : undefined} 
                    onCancel={handleCancel} 
                    progress={isUploading ? uploadProgress : null}
                    progressMessages={isAnalyzing ? loadingMessages : undefined}
                />
            </Overlay>
        )}
        {overlayContent && <Overlay>{overlayContent}</Overlay>}
        {isTourActive && (
            <OnboardingTour steps={tourSteps} />
        )}
        
        {/* Render Sidebar only if authenticated AND not checking auth */}
        {isAuthenticated && !isAuthChecking && (
            <>
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <SidebarNav />
                </div>
                
                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <motion.div 
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute top-0 left-0 h-full"
                                onClick={e => e.stopPropagation()}
                            >
                                <SidebarNav onClose={() => setIsMobileMenuOpen(false)} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        )}
        
        <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden relative">
                <ErrorBoundary>
                    <AnimatePresence mode="wait">
                    <motion.div
                        key={isAuthenticated ? 'authed' : 'unauthed'}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                    {/* If checking auth, renderContent handles the loader. If not, it renders Auth or App */}
                    {!isAuthenticated || isAuthChecking ? (
                        renderContent()
                    ) : (
                        <>
                        <motion.header
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="glass-card flex justify-between items-center mb-8 p-4 sticky top-0 z-30"
                        >
                            <div className="flex items-center gap-4 overflow-hidden">
                                <button 
                                    className="md:hidden p-1 text-gray-300 hover:text-white rounded-md hover:bg-white/10"
                                    onClick={() => setIsMobileMenuOpen(true)}
                                >
                                    <Bars3Icon className="h-6 w-6" />
                                </button>

                                {currentToolConfig && (
                                    <div className="min-w-0">
                                    <h1 className="text-lg sm:text-2xl font-bold text-white truncate">{isGenerationView ? getGreeting() : currentToolConfig.label}</h1>
                                    <p className="text-xs sm:text-sm text-gray-300 mt-1 truncate hidden sm:block">{isGenerationView ? "What masterpiece will you bring to life today?" : currentToolConfig.description}</p>
                                    </div>
                                )}
                                <div className="hidden sm:block h-10 border-l border-white/20"></div>
                                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-300 min-w-0">
                                    <FolderIcon className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                                    <span className="font-medium text-white truncate max-w-xs" title={activeProject?.name || 'No Active Project'}>
                                        {activeProject?.name || 'No Active Project'}
                                    </span>
                                </div>
                            </div>
                            {currentUser && (
                            <div id="user-menu-area" className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                                <span className="text-sm font-medium hidden md:inline text-white">
                                    {currentUser.name || currentUser.email.split('@')[0]}
                                </span>
                                <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={startTour}
                                    className="p-2 rounded-full text-white hover:bg-white/20 hidden sm:block"
                                    aria-label="Start tour"
                                    title="Start Tour"
                                >
                                    <QuestionMarkCircleIcon className="h-6 w-6" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={handleProjectsModalToggle}
                                    className="p-2 rounded-full text-white hover:bg-white/20"
                                    aria-label="View projects"
                                    title="Projects"
                                >
                                    <FolderIcon className="h-6 w-6" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsHistoryOpen(true)}
                                    className="p-2 rounded-full text-white hover:bg-white/20"
                                    aria-label="View history"
                                    title="History"
                                >
                                    <HistoryIcon className="h-6 w-6" />
                                </motion.button>
                                {analysisResult && (
                                    <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={() => setIsExportHubOpen(true)}
                                    className="p-2 rounded-full text-white hover:bg-white/20"
                                    aria-label="Export results"
                                    title="Export"
                                    >
                                    <ExportIcon className="h-6 w-6" />
                                </motion.button>
                                )}
                                <motion.button
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                    onClick={handleLogout}
                                    className="p-2 rounded-full text-white hover:bg-white/20"
                                    aria-label="Logout"
                                    title="Logout"
                                >
                                    <LogoutIcon className="h-6 w-6" />
                                </motion.button>
                            </div>
                            )}
                        </motion.header>
                        
                            <AnimatePresence mode="wait">
                            <motion.div
                                key={analysisType}
                                variants={pageVariants}
                                initial="initial"
                                animate="in"
                                exit="out"
                                transition={pageTransition}
                            >
                                {renderContent()}
                            </motion.div>
                            </AnimatePresence>
                        
                        </>
                    )}
                    </motion.div>
                    </AnimatePresence>
                </ErrorBoundary>
            </main>
        </div>
        
        <AnalysisHistoryModal />
        <ExportHubModal isOpen={isExportHubOpen} onClose={() => setIsExportHubOpen(false)} />
        <ProjectsModal />
    </div>
  );
};