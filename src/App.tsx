- import React, { useState, useRef, useEffect } from 'react';
+ import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Heart, 
  Star, 
  Gift, 
  Sparkles, 
  ShoppingBag, 
  Mail, 
  Phone, 
  User, 
  MapPin,
  Send,
  Crown,
  Candy,
  Trophy,
  Gem,
  Zap,
  Target,
  Clock,
  CheckCircle,
  X,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

// Types
type Phase = 'welcome' | 'quiz' | 'loading-quiz' | 'intro' | 'products' | 'loading1' | 'wheel1' | 'loading2' | 'chest' | 'loading3' | 'challenge' | 'loading4' | 'wheel2' | 'checkout';

interface Product {
  id: number;
  name: string;
  image: string;
  originalPrice: number;
  discountPrice: number;
}

interface UserData {
  name: string;
  email: string;
  whatsapp: string;
  address: string;
  cep: string;
}

interface QuizData {
  name: string;
  motivation: string;
  purpose: string;
}

// Mock products data with real Labubu images
const products: Product[] = [
  {
    id: 1,
    name: "Labubu Love Collection",
    image: "/1745405657247____love_8a52899f-bcc4-45ac-ab03-5dca76b65607.webp",
    originalPrice: 249.90,
    discountPrice: 24.90
  },
  {
    id: 2,
    name: "Labubu Halloween Pumpkin",
    image: "/Labubu-Plush-Halloween-Party-Sitting-Pumpkin.png",
    originalPrice: 199.90,
    discountPrice: 24.90
  },
  {
    id: 3,
    name: "Labubu Flip With Me",
    image: "/Pop-Mart-Labubu-The-Monsters-Flip-With-Me-Vinyl-Plush-Doll-Photoroom.webp",
    originalPrice: 279.90,
    discountPrice: 24.90
  },
  {
    id: 4,
    name: "Labubu Classic Beige",
    image: "/20250529185719960-968.webp",
    originalPrice: 229.90,
    discountPrice: 24.90
  },
  {
    id: 5,
    name: "Labubu Industrial",
    image: "/LABUBU-INDUSTRIAL_01.webp",
    originalPrice: 299.90,
    discountPrice: 24.90
  },
  {
    id: 6,
    name: "Labubu Premium Edition",
    image: "/20250529204221861-941.webp",
    originalPrice: 349.90,
    discountPrice: 24.90
  }
];

// In-App Browser Detection Function
const detectInAppBrowser = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Instagram
  if (userAgent.includes('Instagram')) {
    return { isInApp: true, platform: 'Instagram' };
  }
  
  // TikTok
  if (userAgent.includes('TikTok') || userAgent.includes('musical_ly')) {
    return { isInApp: true, platform: 'TikTok' };
  }
  
  // Facebook
  if (userAgent.includes('FBAN') || userAgent.includes('FBAV') || userAgent.includes('FB_IAB')) {
    return { isInApp: true, platform: 'Facebook' };
  }
  
  // WhatsApp
  if (userAgent.includes('WhatsApp')) {
    return { isInApp: true, platform: 'WhatsApp' };
  }
  
  // Twitter/X
  if (userAgent.includes('Twitter')) {
    return { isInApp: true, platform: 'Twitter' };
  }
  
  // LinkedIn
  if (userAgent.includes('LinkedInApp')) {
    return { isInApp: true, platform: 'LinkedIn' };
  }
  
  return { isInApp: false, platform: null };
};

// In-App Browser Warning Component
const InAppBrowserWarning = ({ platform, onDismiss }: { platform: string; onDismiss: () => void }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const getInstructions = () => {
    switch (platform) {
      case 'Instagram':
        return {
          steps: [
            "Toque nos 3 pontinhos (⋯) no canto superior direito",
            "Selecione 'Abrir no navegador' ou 'Abrir no Chrome/Safari'",
            "A página será aberta no seu navegador principal"
          ],
          icon: "📱"
        };
      case 'TikTok':
        return {
          steps: [
            "Toque nos 3 pontinhos (⋯) no canto superior direito",
            "Selecione 'Abrir no navegador'",
            "Escolha seu navegador preferido (Chrome, Safari, etc.)"
          ],
          icon: "🎵"
        };
      case 'Facebook':
        return {
          steps: [
            "Toque no ícone de menu (☰) no canto superior direito",
            "Selecione 'Abrir no navegador externo'",
            "A página será redirecionada para seu navegador"
          ],
          icon: "👥"
        };
      case 'WhatsApp':
        return {
          steps: [
            "Toque nos 3 pontinhos (⋯) no canto superior direito",
            "Selecione 'Abrir no navegador'",
            "Escolha Chrome, Safari ou seu navegador preferido"
          ],
          icon: "💬"
        };
      default:
        return {
          steps: [
            "Procure pelo menu ou opções no topo da tela",
            "Selecione 'Abrir no navegador' ou similar",
            "Escolha seu navegador preferido"
          ],
          icon: "🌐"
        };
    }
  };

  const instructions = getInstructions();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-modal-enter">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-gentle-pulse">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {instructions.icon} Detectamos que você está no {platform}
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Para uma experiência completa e sem problemas, recomendamos abrir esta página no seu navegador principal.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl text-lg font-bold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Como abrir no navegador?
            </button>
            
            <button
              onClick={onDismiss}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-2xl text-base font-semibold transform transition-all duration-200 hover:bg-gray-300 active:scale-95"
            >
              Continuar mesmo assim
            </button>
          </div>

          {/* Instructions */}
          {showInstructions && (
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 animate-slide-in">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Instruções para {platform}:
              </h4>
              <ol className="text-left text-sm text-blue-700 space-y-2">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal Component for Results
const ResultModal = ({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  buttonText = "Continuar",
  type = "success" 
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  type?: "success" | "error" | "info";
}) => {
  if (!isOpen) return null;

  const bgColor = type === "success" ? "from-green-400 to-emerald-500" : 
                  type === "error" ? "from-red-400 to-red-500" : 
                  "from-blue-400 to-blue-500";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all duration-500 animate-modal-enter">
        <div className="text-center">
          <div className={`w-20 h-20 bg-gradient-to-br ${bgColor} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-gentle-pulse`}>
            {type === "success" && <Trophy className="w-10 h-10 text-white" />}
            {type === "error" && <X className="w-10 h-10 text-white" />}
            {type === "info" && <Sparkles className="w-10 h-10 text-white" />}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
          
          <button
            onClick={onClose}
            className={`w-full bg-gradient-to-r ${bgColor} text-white py-4 rounded-2xl text-lg font-bold shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [currentPhase, setCurrentPhase] = useState<Phase>('welcome');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    whatsapp: '',
    address: '',
    cep: ''
  });
  const [quizData, setQuizData] = useState<QuizData>({
    name: '',
    motivation: '',
    purpose: ''
  });
  const [quizStep, setQuizStep] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheel1Result, setWheel1Result] = useState('');
  const [wheel2Result, setWheel2Result] = useState('');
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [challengeScore, setChallengeScore] = useState(0);

  // Modal states
  const [showResultModal, setShowResultModal] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', buttonText: 'Continuar', type: 'success' as const });

  // In-App Browser Detection
  const [inAppBrowser, setInAppBrowser] = useState<{ isInApp: boolean; platform: string | null }>({ isInApp: false, platform: null });
  const [showInAppWarning, setShowInAppWarning] = useState(false);

  // Check for in-app browser on component mount
  useEffect(() => {
    const browserInfo = detectInAppBrowser();
    setInAppBrowser(browserInfo);
    if (browserInfo.isInApp) {
      setShowInAppWarning(true);
    }
  }, []);

  const showModal = (title: string, message: string, buttonText = 'Continuar', type: 'success' | 'error' | 'info' = 'success') => {
    setModalData({ title, message, buttonText, type });
    setShowResultModal(true);
  };

  // Auto advance when 3 products selected
  useEffect(() => {
    if (selectedProducts.length === 3 && currentPhase === 'products') {
      setTimeout(() => {
        setCurrentPhase('loading1');
      }, 1000);
    }
  }, [selectedProducts.length, currentPhase]);

  // FIXED: Individual handlers for each form field to prevent focus loss
  const handleNameChange = (value: string) => {
    setUserData(prev => ({ ...prev, name: value }));
  };

  const handleEmailChange = (value: string) => {
    setUserData(prev => ({ ...prev, email: value }));
  };

  const handleWhatsappChange = (value: string) => {
    setUserData(prev => ({ ...prev, whatsapp: value }));
  };

  const handleCepChange = (value: string) => {
    setUserData(prev => ({ ...prev, cep: value }));
  };

  const handleAddressChange = (value: string) => {
    setUserData(prev => ({ ...prev, address: value }));
  };

  // FIXED: Individual handler for quiz name field
  const handleQuizNameChange = (value: string) => {
    setQuizData(prev => ({ ...prev, name: value }));
  };

  // Loading Screen Component - SIMPLIFIED AND FIXED
  const LoadingScreen = ({ message, nextPhase }: { message: string; nextPhase: Phase }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setCurrentPhase(nextPhase);
            }, 500);
            return 100;
          }
          return prev + 3;
        });
      }, 100);

      return () => clearInterval(timer);
    }, [nextPhase]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Logo no canto superior esquerdo */}
        <div className="absolute top-4 left-4 z-20">
          <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-12 w-auto" />
        </div>

        <div className="text-center z-10 max-w-sm">
          <div className="mb-8">
            <div className="relative">
              <Crown className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-spin-slow" />
              <div className="absolute inset-0 animate-ping">
                <Crown className="w-20 h-20 text-yellow-300 mx-auto opacity-30" />
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-pink-200 mb-6">
              <h2 className="text-xl font-bold text-purple-600 mb-3">
                {message}
              </h2>
              
              {/* Progress Bar */}
              <div className="w-full bg-pink-200 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // NEW: Welcome Phase
  const WelcomePhase = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Logo no canto superior esquerdo */}
      <div className="absolute top-4 left-4 z-20">
        <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-12 w-auto" />
      </div>

      <div className="text-center z-10 max-w-sm">
        <div className="mb-8">
          {/* Labubu Image with Subtle Float Effect */}
          <div className="relative mb-6">
            <div className="absolute -inset-6 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full animate-gentle-pulse"></div>
            <img 
              src="/imglabubu.png" 
              alt="Labubus" 
              className="w-80 mx-auto drop-shadow-2xl animate-subtle-float"
            />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-pink-200 mb-8 transform hover:scale-105 transition-all duration-300">
          <h1 className="text-2xl font-bold text-purple-600 mb-4 flex items-center justify-center gap-2">
            <Gift className="w-8 h-8 text-pink-500" />
            Acesso exclusivo liberado para você!
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Você acaba de entrar no espaço secreto da Labubu Shop, onde fãs de verdade ganham.
          </p>
          <p className="text-base text-gray-600">
            Mas antes de continuar, responde rapidinho, isso ajuda a gente a montar o seu baú personalizado.
          </p>
        </div>

        <button
          onClick={() => setCurrentPhase('quiz')}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 flex items-center gap-2 mx-auto animate-glow"
        >
          <Sparkles className="w-6 h-6 animate-spin-slow" />
          Vamos começar!
        </button>
      </div>
    </div>
  );

  // NEW: Quiz Phase
  const QuizPhase = () => {
    const canAdvance = () => {
      switch (quizStep) {
        case 1: return quizData.name.trim().length > 0;
        case 2: return quizData.motivation.length > 0;
        case 3: return quizData.purpose.length > 0;
        default: return false;
      }
    };

    const handleNext = () => {
      if (quizStep < 3) {
        setQuizStep(quizStep + 1);
      } else {
        setCurrentPhase('loading-quiz');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
        <div className="max-w-md mx-auto">
          {/* Header with Logo */}
          <div className="flex items-center justify-between mb-6">
            <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-10 w-auto" />
            <div className="text-purple-500 font-semibold">
              {quizStep}/3
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-pink-200 rounded-full h-2 mb-8">
            <div 
              className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
              style={{ width: `${(quizStep / 3) * 100}%` }}
            />
          </div>

          <div className="bg-white/95 rounded-2xl p-6 shadow-xl border-4 border-pink-200 mb-6">
            {/* Question 1 - Name */}
            {quizStep === 1 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-600 mb-6">
                  Qual é o seu nome?
                </h2>
                <input
                  type="text"
                  value={quizData.name}
                  onChange={(e) => handleQuizNameChange(e.target.value)}
                  className="w-full p-4 border-3 border-pink-200 rounded-xl focus:border-purple-400 focus:outline-none text-center text-lg font-semibold transition-all duration-300 hover:shadow-lg mb-6"
                  placeholder="Ana, João, Duda..."
                  autoFocus
                />
              </div>
            )}

            {/* Question 2 - Motivation */}
            {quizStep === 2 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-600 mb-6">
                  Você gostaria de GANHAR produtos da nossa loja com um super desconto?
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'love', text: 'Claro! Eu amo Labubus 😍', color: 'from-pink-400 to-red-400' },
                    { value: 'money', text: 'Sim, se for de verdade eu tô dentro 💸', color: 'from-green-400 to-emerald-400' },
                    { value: 'skeptical', text: 'Quero muito, mas parece bom demais… (testa aí 😉)', color: 'from-yellow-400 to-orange-400' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setQuizData(prev => ({ ...prev, motivation: option.value }))}
                      className={`w-full p-4 rounded-xl text-white font-bold shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 ${
                        quizData.motivation === option.value 
                          ? `bg-gradient-to-r ${option.color} scale-105 animate-glow` 
                          : `bg-gradient-to-r ${option.color} opacity-70 hover:opacity-100`
                      }`}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Question 3 - Purpose */}
            {quizStep === 3 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-purple-600 mb-6">
                  Esse Labubu seria pra você ou pra presentear alguém especial?
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'myself', text: 'É um presente pra mim. Eu mereço 💖', color: 'from-purple-400 to-pink-400', icon: '💖' },
                    { value: 'gift', text: 'É pra alguém especial! Quero surpreender 🎁', color: 'from-blue-400 to-cyan-400', icon: '🎁' },
                    { value: 'both', text: 'Talvez... pros dois? Hehe 😅', color: 'from-yellow-400 to-pink-400', icon: '😅' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setQuizData(prev => ({ ...prev, purpose: option.value }))}
                      className={`w-full p-4 rounded-xl text-white font-bold shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 ${
                        quizData.purpose === option.value 
                          ? `bg-gradient-to-r ${option.color} scale-105 animate-glow` 
                          : `bg-gradient-to-r ${option.color} opacity-70 hover:opacity-100`
                      }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span>{option.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            className={`w-full py-4 rounded-2xl text-lg font-bold shadow-lg transform transition-all duration-300 flex items-center justify-center gap-2 ${
              canAdvance()
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 active:scale-95 animate-glow'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {quizStep < 3 ? (
              <>
                <CheckCircle className="w-6 h-6" />
                Próxima pergunta
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Finalizar
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // NEW: Quiz Loading Phase with Modal
  const QuizLoadingPhase = () => {
    const [progress, setProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setShowModal(true);
            }, 500);
            return 100;
          }
          return prev + 4;
        });
      }, 100);

      return () => clearInterval(timer);
    }, []);

    const handleModalClose = () => {
      setShowModal(false);
      setTimeout(() => {
        setCurrentPhase('intro');
      }, 300);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Logo no canto superior esquerdo */}
        <div className="absolute top-4 left-4 z-20">
          <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-12 w-auto" />
        </div>

        <div className="text-center z-10 max-w-sm">
          <div className="mb-8">
            <div className="relative">
              <Gift className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
              <div className="absolute inset-0 animate-ping">
                <Gift className="w-20 h-20 text-green-400 mx-auto opacity-30" />
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-green-200 mb-6">
              <h2 className="text-xl font-bold text-green-600 mb-3">
                Seu baú tá sendo preparado com base nas suas respostas...
              </h2>
              
              {/* Progress Bar */}
              <div className="w-full bg-green-200 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-green-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <ResultModal
          isOpen={showModal}
          onClose={handleModalClose}
          title={`Parabéns, ${quizData.name}!`}
          message="Você acaba de desbloquear a chance de escolher até 3 Labubus incríveis! Essa oportunidade foi gerada exclusivamente pra você, e só pode ser usada uma única vez."
          buttonText="Começar minha aventura"
          type="success"
        />
      </div>
    );
  };

  // Phase 1 - Intro
  const IntroPhase = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-200 to-blue-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Logo no canto superior esquerdo */}
      <div className="absolute top-4 left-4 z-20">
        <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-12 w-auto" />
      </div>

      <div className="text-center z-10 max-w-sm">
        <div className="mb-8">
          <div className="relative mb-6">
            <Crown className="w-20 h-20 text-yellow-400 mx-auto animate-float" />
            <div className="absolute -inset-4 animate-ping">
              <div className="w-28 h-28 bg-yellow-300/20 rounded-full mx-auto"></div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-purple-600 mb-6 animate-text-glow">
            Portal dos Tesouros Labubu
          </h1>

          {/* Labubu Image with Subtle Float Effect */}
          <div className="relative mb-6">
            <div className="absolute -inset-6 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full animate-gentle-pulse"></div>
            <img 
              src="/imglabubu.png" 
              alt="Labubus" 
              className="w-80 mx-auto drop-shadow-2xl animate-subtle-float"
            />
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-pink-200 mb-8 transform hover:scale-105 transition-all duration-300">
          <p className="text-lg text-gray-700 leading-relaxed">
            {quizData.name && <span className="text-purple-600 font-bold">{quizData.name}, </span>}
            você está prestes a participar de um jogo encantado onde pode ganhar até 3 Labubus… 
            <span className="text-pink-500 font-bold animate-pulse">totalmente grátis!</span> 
          </p>
        </div>

        <button
          onClick={() => setCurrentPhase('products')}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 flex items-center gap-2 mx-auto animate-glow"
        >
          <Sparkles className="w-6 h-6 animate-spin-slow" />
          Começar minha aventura
        </button>
      </div>
    </div>
  );

  // Phase 2 - Product Selection
  const ProductsPhase = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header with Logo */}
        <div className="flex items-center justify-between mb-6">
          <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-10 w-auto" />
          <div className="relative">
            <ShoppingBag className="w-8 h-8 text-purple-500" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
              {selectedProducts.length}
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-purple-600 mb-2">
            {quizData.name && <span>Olá, {quizData.name}! </span>}
            Escolha seus Tesouros!
          </h2>
          <p className="text-gray-600 text-sm">
            Escolha até 3 Labubus para compor seu Baú dos Tesouros!
            Você poderá ganhá-los 100% de graça no final do jogo!
          </p>
          <div className="mt-2 text-purple-500 font-semibold">
            <div className="flex justify-center items-center gap-2">
              <span>Selecionados: {selectedProducts.length}/3</span>
              {selectedProducts.length === 3 && (
                <CheckCircle className="w-5 h-5 text-green-500 animate-bounce" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {products.map((product) => {
            const isSelected = selectedProducts.find(p => p.id === product.id);
            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl p-3 shadow-lg border-3 transition-all duration-300 transform ${
                  isSelected 
                    ? 'border-purple-400 scale-105 shadow-purple-200 animate-selected-glow' 
                    : 'border-pink-200 hover:scale-102 hover:shadow-xl'
                }`}
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100 relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-yellow-400 animate-bounce" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-sm font-semibold text-gray-800 mb-2 text-center">
                  {product.name}
                </h3>
                
                <div className="text-center mb-3">
                  <span className="text-xs text-gray-400 line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                  <div className="text-lg font-bold text-green-600">
                    R$ {product.discountPrice.toFixed(2)}
                  </div>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -90%
                  </span>
                </div>
                
                <button
                  onClick={() => {
                    if (isSelected) {
                      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
                    } else if (selectedProducts.length < 3) {
                      setSelectedProducts(prev => [...prev, product]);
                    }
                  }}
                  disabled={!isSelected && selectedProducts.length >= 3}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-1 transform hover:scale-105 ${
                    isSelected
                      ? 'bg-purple-500 text-white animate-glow'
                      : selectedProducts.length >= 3
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-pink-400 text-white hover:bg-pink-500'
                  }`}
                >
                  <Trophy className="w-3 h-3" />
                  {isSelected ? 'No Baú!' : 'Adicionar ao Baú'}
                </button>
              </div>
            );
          })}
        </div>

        {selectedProducts.length === 3 && (
          <div className="bg-green-100 border-4 border-green-300 rounded-2xl p-4 text-center">
            <h3 className="text-lg font-bold text-green-700 mb-2">Baú Completo!</h3>
            <p className="text-green-600 text-sm">
              Preparando sua aventura mágica...
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Enhanced Wheel Component
  const WheelComponent = ({ onSpin, result, options, colors, isSpinning: spinning }: {
    onSpin: () => void;
    result: string;
    options: string[];
    colors: string[];
    isSpinning: boolean;
  }) => {
    const wheelRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
      if (result && wheelRef.current) {
        const targetIndex = options.indexOf(result);
        const finalRotation = 360 * 8 + (360 - (targetIndex * (360 / options.length)));
        setRotation(finalRotation);
      }
    }, [result, options]);

    return (
      <div className="relative w-72 h-72 mx-auto mb-8">
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 to-pink-300 shadow-2xl"></div>
        
        {/* Wheel */}
        <div 
          ref={wheelRef}
          className={`absolute inset-4 rounded-full border-8 border-white shadow-inner transition-transform ${
            spinning ? 'duration-[4000ms] ease-out' : 'duration-1000'
          }`}
          style={{
            background: `conic-gradient(${colors.map((color, i) => 
              `${color} ${(i * 360) / colors.length}deg ${((i + 1) * 360) / colors.length}deg`
            ).join(', ')})`,
            transform: `rotate(${rotation}deg)`
          }}
        >
          {options.map((option, index) => {
            const angle = (index * 360) / options.length;
            return (
              <div
                key={index}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotate(${angle}deg)`,
                  clipPath: `polygon(50% 50%, 
                    ${50 + 40 * Math.cos((angle - 360/options.length/2) * Math.PI / 180)}% 
                    ${50 + 40 * Math.sin((angle - 360/options.length/2) * Math.PI / 180)}%, 
                    ${50 + 40 * Math.cos((angle + 360/options.length/2) * Math.PI / 180)}% 
                    ${50 + 40 * Math.sin((angle + 360/options.length/2) * Math.PI / 180)}%)`
                }}
              >
                <div 
                  className="text-xs font-bold text-white text-center px-2"
                  style={{ 
                    transform: `rotate(${90 + angle}deg)`,
                    maxWidth: '80px'
                  }}
                >
                  {option.split(' ').slice(0, 3).join(' ')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pointer */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-12 border-transparent border-b-red-500 z-10 drop-shadow-lg"></div>
        
        {/* Center button */}
        <button
          onClick={onSpin}
          disabled={spinning}
          className={`absolute inset-0 m-auto w-20 h-20 bg-gradient-to-br from-white to-gray-100 rounded-full shadow-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
            spinning 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-110 hover:shadow-3xl active:scale-95'
          }`}
        >
          {spinning ? (
            <div className="animate-spin">⚡</div>
          ) : (
            <div className="animate-bounce">✨</div>
          )}
        </button>
      </div>
    );
  };

  // Phase 3 - First Wheel
  const Wheel1Phase = () => {
    const options = [
      "90% OFF em 1 item",
      "90% OFF em 2 itens", 
      "GANHE +1 item grátis",
      "Cupom mágico 90% por 7 dias",
      "Upgrade embalagem fofa",
      "90% OFF em TODOS os itens"
    ];
    
    const colors = [
      "#FF6B9D", "#4ECDC4", "#45B7D1", 
      "#96CEB4", "#FECA57", "#FF9FF3"
    ];

    const handleSpin = () => {
      setIsSpinning(true);
      setTimeout(() => {
        setWheel1Result("90% OFF em TODOS os itens");
        setIsSpinning(false);
        showModal(
          "Você ganhou!",
          "90% OFF em TODOS os itens! Seus tesouros estão ainda mais baratos!",
          "Continuar"
        );
      }, 4000);
    };

    const handleModalClose = () => {
      setShowResultModal(false);
      setTimeout(() => {
        setCurrentPhase('loading2');
      }, 300);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Logo no canto superior esquerdo */}
        <div className="absolute top-4 left-4 z-20">
          <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-10 w-auto" />
        </div>

        <div className="text-center max-w-sm">
          <div className="mb-6">
            <Gem className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-spin-slow" />
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              Roleta Mágica do Portal!
            </h2>
            <p className="text-gray-600 mb-8 bg-white/90 rounded-2xl p-4 shadow-lg">
              Gire para turbinar seu baú com descontos e bônus especiais!
            </p>
          </div>

          <WheelComponent 
            onSpin={handleSpin}
            result={wheel1Result}
            options={options}
            colors={colors}
            isSpinning={isSpinning}
          />
        </div>

        <ResultModal
          isOpen={showResultModal}
          onClose={handleModalClose}
          title={modalData.title}
          message={modalData.message}
          buttonText={modalData.buttonText}
          type={modalData.type}
        />
      </div>
    );
  };

  // Phase 4 - Chest Opening - ENHANCED WITH PRODUCT IMAGES
  const ChestPhase = () => (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="text-center max-w-sm">
        <div className="relative mb-8">
          <div className="w-40 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl mx-auto relative animate-chest-glow shadow-2xl">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-yellow-600 rounded-t-2xl"></div>
            <div className="absolute inset-4 bg-yellow-300 rounded-2xl"></div>
            <Crown className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-yellow-800 animate-bounce" />
            
            {/* Lock */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-800 rounded-full"></div>
          </div>
        </div>

        {/* Logo abaixo do baú (APENAS nesta tela) */}
        <div className="mb-6">
          <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-16 w-auto mx-auto opacity-90" />
        </div>

        <h2 className="text-2xl font-bold text-orange-600 mb-6 animate-text-glow">
          {quizData.name && <span>{quizData.name}, </span>}
          Uau! Seu baú está cheio de magia!
        </h2>

        {/* ENHANCED: Show products with images */}
        <div className="bg-white/95 rounded-2xl p-6 mb-6 shadow-xl border-4 border-orange-200">
          <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            Seus Tesouros Escolhidos
          </h3>
          
          <div className="space-y-4">
            {selectedProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 animate-slide-in" style={{ animationDelay: `${index * 0.2}s` }}>
                {/* Product Image */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-lg flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Product Info */}
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-bold text-gray-800 mb-1">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      R$ 24,90
                    </span>
                    <span className="text-xs text-red-500 font-bold">-90%</span>
                  </div>
                </div>
                
                {/* Sparkle Effect */}
                <Sparkles className="w-5 h-5 text-yellow-500 animate-spin-slow" />
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-700 mb-6 bg-white/90 rounded-2xl p-4 shadow-lg">
          Mas… você ainda pode ganhar 
          <span className="text-purple-600 font-bold"> TUDO de graça </span>
          se conseguir passar no desafio final!
        </p>

        <button
          onClick={() => setCurrentPhase('loading3')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-glow"
        >
          <Zap className="w-6 h-6 animate-bounce" />
          Aceitar o Desafio Final!
        </button>
      </div>
    </div>
  );

  // Challenge Phase
  const ChallengePhase = () => {
    const [timeLeft, setTimeLeft] = useState(4); // 4 seconds as requested
    const [currentTarget, setCurrentTarget] = useState(0);
    const [hits, setHits] = useState(0);
    const [gameActive, setGameActive] = useState(false);
    const [targets, setTargets] = useState<Array<{id: number, x: number, y: number, hit: boolean}>>([]);
    const [showFailModal, setShowFailModal] = useState(false);

    useEffect(() => {
      if (gameActive && timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else if (timeLeft === 0 && gameActive) {
        setGameActive(false);
        // Smooth transition with 500ms delay as requested
        setTimeout(() => {
          if (hits >= 5) {
            setChallengeCompleted(true);
            setChallengeScore(hits);
            showModal(
              "DESAFIO CONCLUÍDO!",
              "Você provou ser digno dos tesouros! Agora você pode ganhar tudo de graça!",
              "Continuar para o prêmio"
            );
          } else {
            setShowFailModal(true);
          }
        }, 500);
      }
    }, [timeLeft, gameActive, hits]);

    const startGame = () => {
      setGameActive(true);
      setTimeLeft(4);
      setHits(0);
      setShowFailModal(false);
      generateTargets();
    };

    const generateTargets = () => {
      const newTargets = Array.from({length: 8}, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 20 + Math.random() * 60,
        hit: false
      }));
      setTargets(newTargets);
    };

    const hitTarget = (id: number) => {
      if (!gameActive) return;
      setTargets(prev => prev.map(t => t.id === id ? {...t, hit: true} : t));
      setHits(prev => prev + 1);
      setTimeout(generateTargets, 500);
    };

    const handleSuccessModalClose = () => {
      setShowResultModal(false);
      setTimeout(() => {
        setCurrentPhase('loading4');
      }, 300);
    };

    const handleFailModalClose = () => {
      setShowFailModal(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-200 via-orange-200 to-yellow-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Logo no canto superior esquerdo */}
        <div className="absolute top-4 left-4 z-20">
          <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-10 w-auto" />
        </div>

        <div className="text-center max-w-sm relative">
          <Target className="w-16 h-16 text-red-500 mx-auto mb-4 animate-spin-slow" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Desafio dos Labubus!
          </h2>
          
          <div className="bg-white/95 rounded-2xl p-6 mb-6 shadow-xl">
            <p className="text-gray-700 mb-4">
              Os Labubus querem testar sua habilidade! 
              Acerte <span className="font-bold text-red-500">5 alvos em 4 segundos</span> 
              para ganhar tudo de graça!
            </p>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-lg">{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-500" />
                <span className="font-bold text-lg">{hits}/5</span>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className="relative w-full h-64 bg-white/90 rounded-2xl mb-6 overflow-hidden border-4 border-red-200">
            {gameActive && targets.map(target => (
              <button
                key={target.id}
                onClick={() => hitTarget(target.id)}
                disabled={target.hit}
                className={`absolute w-12 h-12 rounded-full transition-all duration-300 ${
                  target.hit 
                    ? 'bg-green-500 scale-150 opacity-50' 
                    : 'bg-red-500 hover:bg-red-600 hover:scale-110'
                }`}
                style={{
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🎯
              </button>
            ))}
            
            {!gameActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startGame}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
                >
                  {challengeCompleted ? 'Desafio Concluído!' : 'Iniciar Desafio'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Success Modal */}
        <ResultModal
          isOpen={showResultModal}
          onClose={handleSuccessModalClose}
          title={modalData.title}
          message={modalData.message}
          buttonText={modalData.buttonText}
          type={modalData.type}
        />

        {/* Fail Modal */}
        <ResultModal
          isOpen={showFailModal}
          onClose={handleFailModalClose}
          title="Ops! Tente novamente!"
          message="Você quase conseguiu! Os Labubus acreditam em você. Tente mais uma vez!"
          buttonText="Tentar Novamente"
          type="error"
        />
      </div>
    );
  };

  // Phase 5 - Final Wheel (only if challenge completed)
  const Wheel2Phase = () => {
    const options = [
      "100% OFF - só frete R$ 24,90",
      "Brinde especial incluso",
      "Frete grátis + 50% OFF",
      "Cupom 95% próxima compra",
      "Gire novamente",
      "Embalagem premium grátis"
    ];
    
    const colors = [
      "#FF1744", "#00E676", "#2196F3", 
      "#FF9800", "#9C27B0", "#4CAF50"
    ];

    const handleSpin = () => {
      setIsSpinning(true);
      setTimeout(() => {
        setWheel2Result("100% OFF - só frete R$ 24,90");
        setIsSpinning(false);
        showModal(
          "VOCÊ CONSEGUIU!",
          "100% OFF - só frete R$ 24,90! Seu baú está 100% GRÁTIS! Agora é só confirmar o envio!",
          "Finalizar Pedido"
        );
      }, 4000);
    };

    const handleModalClose = () => {
      setShowResultModal(false);
      setTimeout(() => {
        setCurrentPhase('checkout');
      }, 300);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-blue-300 to-pink-300 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Logo no canto superior esquerdo */}
        <div className="absolute top-4 left-4 z-20">
          <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-10 w-auto" />
        </div>

        <div className="text-center max-w-sm">
          <div className="mb-6">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-purple-600 mb-4">
              Roleta Final do Tesouro!
            </h2>
            <div className="bg-white/95 rounded-2xl p-4 mb-6 shadow-lg">
              <p className="text-gray-700 mb-2">
                <span className="text-green-600 font-bold">Parabéns, {quizData.name || 'campeão'}!</span>
              </p>
              <p className="text-gray-700">
                Você passou no desafio e agora pode ganhar TODOS os brinquedos sem pagar nada. 
                Só o frete de entrega!
              </p>
            </div>
          </div>

          <WheelComponent 
            onSpin={handleSpin}
            result={wheel2Result}
            options={options}
            colors={colors}
            isSpinning={isSpinning}
          />
        </div>

        <ResultModal
          isOpen={showResultModal}
          onClose={handleModalClose}
          title={modalData.title}
          message={modalData.message}
          buttonText={modalData.buttonText}
          type={modalData.type}
        />
      </div>
    );
  };

  // Phase 6 - Checkout - ENHANCED WITH PRODUCT SHOWCASE AND FIXED FORM INPUTS
  const CheckoutPhase = () => {
    const totalOriginalPrice = selectedProducts.reduce((sum, product) => sum + product.originalPrice, 0);
    const totalSavings = totalOriginalPrice - 24.90;
    const savingsPercentage = Math.round((totalSavings / totalOriginalPrice) * 100);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Redirect to payment link
      window.open('https://app.pushinpay.com.br/service/pay/9f45c45f-f64a-4d99-aaf4-748ab43ec57c', '_blank');
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-4">
        <div className="max-w-md mx-auto">
          {/* Header with Logo */}
          <div className="text-center mb-6">
            <img src="/LOGO copy.webp" alt="Labubu Logo" className="h-16 w-auto mx-auto mb-4" />
            
            <div className="relative mb-4">
              <Gift className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                FREE
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              {quizData.name && <span>{quizData.name}, </span>}
              Seus tesouros te esperam!
            </h2>
          </div>

          {/* ENHANCED: Product Showcase with Images */}
          <div className="bg-white/95 rounded-2xl p-6 shadow-xl mb-6 border-4 border-green-200">
            <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" />
              Seus Labubus Conquistados
            </h3>
            
            <div className="space-y-3 mb-6">
              {selectedProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border-2 border-green-200 animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  {/* Product Image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-lg flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 text-left">
                    <h4 className="text-sm font-bold text-gray-800 mb-1">{product.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 line-through">
                        R$ {product.originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        GRÁTIS!
                      </span>
                    </div>
                  </div>
                  
                  {/* Free Badge */}
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-gentle-pulse">
                    100% OFF
                  </div>
                </div>
              ))}
            </div>

            {/* Savings Summary - ENHANCED */}
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-3 border-yellow-300 mb-4">
              <div className="text-center">
                <h4 className="text-lg font-bold text-orange-600 mb-2 flex items-center justify-center gap-2">
                  <Star className="w-5 h-5" />
                  Você está GANHANDO:
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      R$ {totalOriginalPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600">Valor Original</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      R$ {totalSavings.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600">Você Economiza</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-lg font-bold animate-gentle-pulse">
                  {savingsPercentage}% DE DESCONTO!
                </div>
              </div>
            </div>

            {/* Final Price */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border-3 border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Você paga apenas:</p>
              <p className="text-3xl font-bold text-blue-600 mb-1">
                R$ 24,90
              </p>
              <p className="text-xs text-gray-500">
                (apenas frete - produtos 100% GRÁTIS!)
              </p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-bold text-purple-600">
                  {selectedProducts.length} Labubus no seu baú!
                </span>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
  <div className="bg-white/95 rounded-2xl p-6 shadow-xl border-4 border-pink-200">
    <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
      <User className="w-5 h-5" />
      Dados para entrega
    </h3>
    <div className="space-y-4">
      {/* Nome completo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nome completo
        </label>
        <input
          type="text"
          required
          value={userData.name}
          onChange={e => handleNameChange(e.target.value)}
          className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:outline-none transition-all duration-300 hover:shadow-lg"
          placeholder="Seu nome completo"
        />
      </div>
      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          WhatsApp
        </label>
        <input
          type="tel"
          required
          value={userData.whatsapp}
          onChange={e => handleWhatsappChange(e.target.value)}
          className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:outline-none transition-all duration-300 hover:shadow-lg"
          placeholder="(11) 99999-9999"
        />
      </div>
      {/* E-mail */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          E-mail
        </label>
        <input
          type="email"
          required
          value={userData.email}
          onChange={e => handleEmailChange(e.target.value)}
          className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:outline-none transition-all duration-300 hover:shadow-lg"
          placeholder="seu@email.com"
        />
      </div>
      {/* CEP */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          CEP
        </label>
        <input
          type="text"
          required
          value={userData.cep}
          onChange={e => handleCepChange(e.target.value)}
          className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:outline-none transition-all duration-300 hover:shadow-lg"
          placeholder="00000-000"
          maxLength={9}
        />
      </div>
      {/* Endereço completo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Endereço completo
        </label>
        <textarea
          required
          value={userData.address}
          onChange={e => handleAddressChange(e.target.value)}
          className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-purple-400 focus:outline-none h-24 resize-none transition-all duration-300 hover:shadow-lg"
          placeholder="Rua, número, bairro, cidade, estado..."
        />
      </div>
    </div>
  </div>
</form>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-5 rounded-2xl text-xl font-bold shadow-xl transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 animate-glow"
            >
              <Trophy className="w-6 h-6" />
              Liberar meu prêmio
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Seus dados estão protegidos e serão usados apenas para entrega
            </p>
          </form>
        </div>
      </div>
    );
  };

  // Render current phase
  const renderPhase = () => {
    switch (currentPhase) {
      case 'welcome': return <WelcomePhase />;
      case 'quiz': return <QuizPhase />;
      case 'loading-quiz': return <QuizLoadingPhase />;
      case 'intro': return <IntroPhase />;
      case 'products': return <ProductsPhase />;
      case 'loading1': return <LoadingScreen message="Os Labubus estão preparando sua primeira surpresa..." nextPhase="wheel1" />;
      case 'wheel1': return <Wheel1Phase />;
      case 'loading2': return <LoadingScreen message="Organizando seus tesouros no baú mágico..." nextPhase="chest" />;
      case 'chest': return <ChestPhase />;
      case 'loading3': return <LoadingScreen message="Os Labubus estão preparando o desafio final..." nextPhase="challenge" />;
      case 'challenge': return <ChallengePhase />;
      case 'loading4': return <LoadingScreen message="Preparando sua recompensa de campeão..." nextPhase="wheel2" />;
      case 'wheel2': return <Wheel2Phase />;
      case 'checkout': return <CheckoutPhase />;
      default: return <WelcomePhase />;
    }
  };

  return (
    <>
      {renderPhase()}
      
      {/* In-App Browser Warning */}
      {showInAppWarning && inAppBrowser.platform && (
        <InAppBrowserWarning 
          platform={inAppBrowser.platform}
          onDismiss={() => setShowInAppWarning(false)}
        />
      )}
    </>
  );
}

export default App;
