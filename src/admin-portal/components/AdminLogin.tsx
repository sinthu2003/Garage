import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Building2,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Validation patterns
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Toast types
type ToastType = 'error' | 'success' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
}

// Toast Component
const ToastNotification = ({ toast, onClose }: { toast: Toast; onClose: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const bgColors = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5" />,
    success: <CheckCircle2 className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
  };

  return (
    <div
      className={`${bgColors[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 min-w-[320px] max-w-[420px] animate-slideIn`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">{toast.title}</p>
        <p className="text-sm opacity-90 mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading: authLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  // Use ref for submission state to avoid React state issues
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // Toast helpers
  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, location.state]);

  useEffect(() => {
    setMounted(true);
    const rememberedEmail = localStorage.getItem('addax_remembered_email');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Show toast when API error occurs
  useEffect(() => {
    if (error) {
      console.log('Error detected in AdminLogin:', error);

      // Safety net: Ensure submitting state is reset when error occurs
      setIsSubmitting(false);
      submittingRef.current = false;

      addToast('error', 'Sign-in failed', error);
      // Clear error after showing toast (timeout to prevent state update during render)
      setTimeout(() => clearError(), 0);
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear validation errors when inputs change
  useEffect(() => {
    if (touched.email && validationErrors.email) {
      setValidationErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    }
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (touched.password && validationErrors.password) {
      setValidationErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  }, [password]); // eslint-disable-line react-hooks/exhaustive-deps

  // Validate email
  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Email is required';
    }
    if (!EMAIL_PATTERN.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  // Validate password
  const validatePassword = (value: string): string | undefined => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return undefined;
  };

  // Handle blur events
  const handleEmailBlur = () => {
    setEmailFocused(false);
    setTouched((prev) => ({ ...prev, email: true }));
    setValidationErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  };

  const handlePasswordBlur = () => {
    setPasswordFocused(false);
    setTouched((prev) => ({ ...prev, password: true }));
    setValidationErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission using ref
    if (submittingRef.current) return;

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate all fields
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setValidationErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    // Set submitting state
    console.log('Starting login submission...');
    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem('addax_remembered_email', email);
      } else {
        localStorage.removeItem('addax_remembered_email');
      }

      console.log('Calling login API...');
      const result = await login(email, password);
      console.log('Login API result:', result);

    } catch (err) {
      console.error('Unexpected login error:', err);
    } finally {
      console.log('Finally block - resetting submission state');
      // Always reset submitting state
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // Show loading state during initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Sign-in successful</h2>
          <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Addax Automotive</h1>
              <p className="text-sm text-white/80">Admin Portal</p>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-8 max-w-md">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Manage your automotive service business with ease
              </h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Access your dashboard to manage bookings, track services, handle inventory, and grow your business.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: ShieldCheck, text: 'Enterprise-grade security' },
                { icon: Globe, text: 'Access from anywhere' },
                { icon: CheckCircle2, text: 'Real-time analytics' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-white/90">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-3 h-3" />
                  </div>
                  <span className="text-sm">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/70">
            © 2026 Addax Automotive. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className={`w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Addax Automotive</h1>
              <p className="text-sm text-muted-foreground">Admin Portal</p>
            </div>
          </div>

          {/* Sign In Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Sign in</h2>
            <p className="text-muted-foreground">Enter your credentials to access the admin dashboard</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={handleEmailBlur}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full px-4 py-3 bg-background border-2 rounded-lg text-foreground placeholder-muted-foreground transition-all duration-200 ${emailFocused
                    ? 'border-primary shadow-sm'
                    : validationErrors.email && touched.email
                      ? 'border-red-400'
                      : 'border-border hover:border-gray-400'
                    }`}
                />
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-opacity ${email ? 'opacity-100' : 'opacity-0'
                  }`}>
                  {validationErrors.email && touched.email ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
              {/* Error text - positioned absolutely to not affect layout */}
              <div className="h-0 overflow-visible">
                {validationErrors.email && touched.email && (
                  <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.email}</p>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={handlePasswordBlur}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 bg-background border-2 rounded-lg text-foreground placeholder-muted-foreground transition-all duration-200 ${passwordFocused
                    ? 'border-primary shadow-sm'
                    : validationErrors.password && touched.password
                      ? 'border-red-400'
                      : 'border-border hover:border-gray-400'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Error text - positioned absolutely to not affect layout */}
              <div className="h-0 overflow-visible">
                {validationErrors.password && touched.password && (
                  <p className="text-xs text-red-500 mt-1 text-right">{validationErrors.password}</p>
                )}
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/50"
                />
                <span className="text-sm text-muted-foreground">Remember me</span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-sm hover:shadow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">Demo Credentials</span>
              </div>
            </div>

            {/* Demo Info */}
            <div className="bg-secondary/50 border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">Test Account</p>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-mono">
                      Email: admin@addax.com
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Password: admin123
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">Contact Support</a>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}