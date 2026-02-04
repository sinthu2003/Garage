import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Globe,
  X,
  Gauge,
  Car,
  Wrench,
  Settings,
  Fuel,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi, getErrorMessage } from '../../services/api';
import Logo from '../../assets/Logo.jpg';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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

// Forgot Password Modal Steps
type ForgotPasswordStep = 'email' | 'otp' | 'newPassword' | 'success';

const ToastNotification = ({ toast, onClose }: { toast: Toast; onClose: (id: number) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), 5000);
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
    <div className={`${bgColors[toast.type]} text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 min-w-[320px] max-w-[400px] animate-slideIn border border-white/20`}>
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base">{toast.title}</p>
        <p className="text-sm text-white/95 mt-1">{toast.message}</p>
      </div>
      <button onClick={() => onClose(toast.id)} className="flex-shrink-0 hover:bg-white/20 rounded-lg p-1.5 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Forgot Password Modal Component
interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  addToast: (type: ToastType, title: string, message: string) => void;
}

const ForgotPasswordModal = ({ isOpen, onClose, addToast }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('email');
        setEmail('');
        setOtp(['', '', '', '', '', '']);
        setNewPassword('');
        setConfirmPassword('');
        setEmailError('');
        setOtpError('');
        setPasswordError('');
        setTimer(300);
        setCanResend(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }, 300);
    }
  }, [isOpen]);

  // Timer countdown for OTP
  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateEmail(email)) return;
    
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      addToast('success', 'OTP Sent', `A 6-digit code has been sent to ${email}`);
      setStep('otp');
      setTimer(300);
      setCanResend(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      addToast('error', 'Error', errorMessage || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const lastIndex = Math.min(pastedData.length - 1, 5);
    otpRefs.current[lastIndex]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.verifyOtp(email, otpValue);
      setStep('newPassword');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setOtpError(errorMessage || 'Invalid OTP. Please try again.');
      addToast('error', 'Invalid OTP', 'The code you entered is incorrect.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setOtp(['', '', '', '', '', '']);
      setTimer(300);
      setCanResend(false);
      addToast('success', 'OTP Resent', `A new code has been sent to ${email}`);
      otpRefs.current[0]?.focus();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      addToast('error', 'Error', errorMessage || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validatePasswords = (): boolean => {
    if (!newPassword) {
      setPasswordError('Password is required');
      return false;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePasswords()) return;

    setIsLoading(true);
    try {
      const otpValue = otp.join('');
      await authApi.resetPassword(email, otpValue, newPassword);
      
      setStep('success');
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      addToast('error', 'Error', errorMessage || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      setStep('email');
      if (timerRef.current) clearInterval(timerRef.current);
    } else if (step === 'newPassword') {
      setStep('otp');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scaleIn">
        {/* Close Button */}
        {step !== 'success' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Step 1: Email Input */}
        {step === 'email' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <KeyRound className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Forgot Password?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Enter your email address and we'll send you a verification code.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none focus:border-red-500 focus:bg-white focus:shadow-lg focus:shadow-red-500/10 ${
                    emailError ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 pl-1">{emailError}</p>
              )}
            </div>

            <button
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Mail className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Enter Verification Code</h3>
              <p className="text-sm text-gray-500 mt-1">
                We've sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span>
              </p>
            </div>

            {/* OTP Input Boxes */}
            <div className="space-y-2">
              <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-xl font-bold bg-gray-50 border-2 rounded-xl text-gray-900 transition-all duration-200 outline-none focus:border-red-500 focus:bg-white focus:shadow-lg focus:shadow-red-500/10 ${
                      otpError ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-xs text-red-500 text-center">{otpError}</p>
              )}
            </div>

            {/* Timer and Resend */}
            <div className="text-center">
              {!canResend ? (
                <p className="text-sm text-gray-500">
                  Resend code in <span className="font-semibold text-red-600">{formatTime(timer)}</span>
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              onClick={handleBack}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 'newPassword' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <Lock className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Create New Password</h3>
              <p className="text-sm text-gray-500 mt-1">
                Your new password must be at least 6 characters long.
              </p>
            </div>

            <div className="space-y-4">
              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter new password"
                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none focus:border-red-500 focus:bg-white focus:shadow-lg focus:shadow-red-500/10 ${
                      passwordError ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Confirm new password"
                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none focus:border-red-500 focus:bg-white focus:shadow-lg focus:shadow-red-500/10 ${
                      passwordError ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <p className="text-xs text-red-500 pl-1">{passwordError}</p>
              )}
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              onClick={handleBack}
              className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="space-y-6 text-center py-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center animate-scaleIn">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Password Reset Successful!</h3>
              <p className="text-sm text-gray-500 mt-2">
                Your password has been reset successfully. You can now login with your new password.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
            >
              <span>Back to Login</span>
            </button>
          </div>
        )}
      </div>
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
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const submittingRef = useRef(false);

  const addToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

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

  useEffect(() => {
    if (error) {
      setIsSubmitting(false);
      submittingRef.current = false;
      addToast('error', 'Sign-in failed', error);
      setTimeout(() => clearError(), 0);
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return 'Email is required';
    if (!EMAIL_PATTERN.test(value)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return undefined;
  };

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
    if (submittingRef.current) return;

    setTouched({ email: true, password: true });
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setValidationErrors({ email: emailError, password: passwordError });
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      if (rememberMe) {
        localStorage.setItem('addax_remembered_email', email);
      } else {
        localStorage.removeItem('addax_remembered_email');
      }
      await login(email, password);
    } catch (err) {
      console.error('Unexpected login error:', err);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center animate-pulse">
              <img src={Logo} alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
            </div>
            <Loader2 className="w-6 h-6 text-red-500 animate-spin absolute -bottom-1 -right-1" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center animate-fadeIn">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center animate-scaleIn">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Toast Container - z-[60] to appear above modal (z-50) */}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        addToast={addToast}
      />

      {/* Cross-Screen Animations - All start from left (hidden on mobile) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 hidden lg:block">
        {/* Car at the bottom - using lucide-react Car icon */}
        <div className="absolute bottom-4 animate-driveForward car-color">
          <Car className="w-16 h-16" strokeWidth={1.5} stroke="currentColor" />
        </div>

        {/* Floating Mechanical Elements - All start from left */}
        {/* Settings/Gear */}
        <div className="absolute top-[15%] animate-floatAcross1 item-color">
          <Settings className="w-10 h-10 animate-spinSlow" strokeWidth={1.5} />
        </div>
        
        {/* Wrench */}
        <div className="absolute top-[38%] animate-floatAcross2 item-color">
          <Wrench className="w-9 h-9" strokeWidth={1.5} />
        </div>
        
        {/* Bubble */}
        <div className="absolute top-[55%] animate-floatAcross3 item-color">
          <div className="w-7 h-7 rounded-full bg-current" />
        </div>
        
        {/* Gauge/Speedometer */}
        <div className="absolute top-[72%] animate-floatAcross4 item-color">
          <Gauge className="w-10 h-10" strokeWidth={1.5} />
        </div>
        
        {/* Fuel */}
        <div className="absolute top-[28%] animate-floatAcross5 item-color">
          <Fuel className="w-8 h-8" strokeWidth={1.5} />
        </div>
        
        {/* Small Bubble */}
        <div className="absolute top-[85%] animate-floatAcross6 item-color">
          <div className="w-5 h-5 rounded-full bg-current" />
        </div>
      </div>

      {/* Left Side - Red Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] -top-32 -left-32 bg-red-500/30 rounded-full blur-[100px] animate-blob" />
          <div className="absolute w-[400px] h-[400px] bottom-0 right-0 bg-orange-500/20 rounded-full blur-[80px] animate-blob animation-delay-2000" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 animate-fadeInDown">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xl ring-2 ring-white/20 hover:ring-white/40 transition-all hover:scale-105">
              <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Addax Automotive</h1>
              <p className="text-xs text-white/70 font-medium">Admin Portal</p>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-6 max-w-md animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              System Online
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight">
              Manage your automotive service business with ease
            </h2>
            <p className="text-base text-white/70 leading-relaxed">
              Access your dashboard to manage bookings, track services, handle inventory, and grow your business.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { icon: ShieldCheck, text: 'Secure' },
                { icon: Globe, text: 'Cloud-based' },
                { icon: Gauge, text: 'Real-time' },
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-all cursor-default group"
                >
                  <feature.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Left */}
          <div className="text-xs text-white/40">
            © 2026 Addax Automotive. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - White Background */}
      <div className="flex-1 relative overflow-hidden bg-white">
        {/* Subtle Background */}
        <div className="absolute inset-0">
          <div className="absolute w-[400px] h-[400px] -top-40 -right-40 bg-gray-100/80 rounded-full blur-[100px] animate-blob" />
          <div className="absolute w-[300px] h-[300px] bottom-20 left-0 bg-red-50/30 rounded-full blur-[80px] animate-blob animation-delay-2000" />
        </div>

        {/* Form Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 lg:p-10">
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-red-500/20">
                <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Addax Automotive</h1>
                <p className="text-xs text-gray-500">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Form - Centered */}
          <div className={`w-full max-w-[380px] mx-auto transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-500">Sign in to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${emailFocused ? 'text-red-500' : 'text-gray-400'}`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={handleEmailBlur}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none ${
                      emailFocused
                        ? 'border-red-500 bg-white shadow-lg shadow-red-500/10'
                        : validationErrors.email && touched.email
                          ? 'border-red-400 bg-red-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  {validationErrors.email && touched.email && (
                    <AlertCircle className="w-5 h-5 text-red-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {validationErrors.email && touched.email && (
                  <p className="text-xs text-red-500 pl-1">{validationErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${passwordFocused ? 'text-red-500' : 'text-gray-400'}`}>
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={handlePasswordBlur}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 outline-none ${
                      passwordFocused
                        ? 'border-red-500 bg-white shadow-lg shadow-red-500/10'
                        : validationErrors.password && touched.password
                          ? 'border-red-400 bg-red-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && touched.password && (
                  <p className="text-xs text-red-500 pl-1">{validationErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-md border-2 border-gray-300 bg-white peer-checked:bg-red-500 peer-checked:border-red-500 transition-all flex items-center justify-center">
                      {rememberMe && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Right - Centered */}
          <div className="text-xs text-gray-400 text-center">
            <a href="/privacy-policy" className="hover:text-gray-600 transition-colors">Privacy</a>
            <span className="mx-2">•</span>
            <a href="/terms-of-service" className="hover:text-gray-600 transition-colors">Terms</a>
            <span className="mx-2">•</span>
            <a href="/contact" className="hover:text-gray-600 transition-colors">Support</a>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Car color transition - starts white, changes to gray */
        .car-color {
          stroke: rgba(255, 255, 255, 0.25);
          color: rgba(255, 255, 255, 0.25);
        }
        
        @keyframes driveForward {
          0% { 
            left: -80px;
            stroke: rgba(255, 255, 255, 0.25);
            color: rgba(255, 255, 255, 0.25);
          }
          49% { 
            stroke: rgba(255, 255, 255, 0.25);
            color: rgba(255, 255, 255, 0.25);
          }
          51% { 
            stroke: rgba(100, 100, 100, 0.35);
            color: rgba(100, 100, 100, 0.35);
          }
          100% { 
            left: 100%;
            stroke: rgba(100, 100, 100, 0.35);
            color: rgba(100, 100, 100, 0.35);
          }
        }
        .animate-driveForward {
          animation: driveForward 14s linear infinite;
        }
        
        .animate-driveForward svg {
          stroke: inherit;
        }
        
        /* Floating items - all start from left */
        .item-color {
          color: rgba(255, 255, 255, 0.35);
        }
        
        @keyframes floatAcross1 {
          0% { left: -50px; color: rgba(255, 255, 255, 0.3); transform: translateY(0); }
          25% { transform: translateY(-15px); }
          49% { color: rgba(255, 255, 255, 0.3); }
          50% { transform: translateY(5px); }
          51% { color: rgba(140, 140, 140, 0.28); }
          75% { transform: translateY(-10px); }
          100% { left: 105%; color: rgba(140, 140, 140, 0.28); transform: translateY(0); }
        }
        .animate-floatAcross1 {
          animation: floatAcross1 22s ease-in-out infinite;
        }
        
        @keyframes floatAcross2 {
          0% { left: -50px; color: rgba(255, 255, 255, 0.28); transform: translateY(0) rotate(0deg); }
          49% { color: rgba(255, 255, 255, 0.28); }
          51% { color: rgba(150, 150, 150, 0.25); }
          100% { left: 105%; color: rgba(150, 150, 150, 0.25); transform: translateY(-20px) rotate(30deg); }
        }
        .animate-floatAcross2 {
          animation: floatAcross2 26s ease-in-out infinite;
          animation-delay: 4s;
        }
        
        @keyframes floatAcross3 {
          0% { left: -40px; color: rgba(255, 255, 255, 0.35); transform: translateY(0); }
          49% { color: rgba(255, 255, 255, 0.35); }
          50% { transform: translateY(-18px); }
          51% { color: rgba(170, 170, 170, 0.3); }
          100% { left: 105%; color: rgba(170, 170, 170, 0.3); transform: translateY(8px); }
        }
        .animate-floatAcross3 {
          animation: floatAcross3 20s ease-in-out infinite;
          animation-delay: 8s;
        }
        
        @keyframes floatAcross4 {
          0% { left: -50px; color: rgba(255, 255, 255, 0.32); transform: translateY(0); }
          49% { color: rgba(255, 255, 255, 0.32); }
          50% { transform: translateY(-12px); }
          51% { color: rgba(130, 130, 130, 0.28); }
          100% { left: 105%; color: rgba(130, 130, 130, 0.28); transform: translateY(-5px); }
        }
        .animate-floatAcross4 {
          animation: floatAcross4 24s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        @keyframes floatAcross5 {
          0% { left: -40px; color: rgba(255, 255, 255, 0.3); transform: translateY(0); }
          40% { transform: translateY(-14px); }
          49% { color: rgba(255, 255, 255, 0.3); }
          51% { color: rgba(145, 145, 145, 0.26); }
          70% { transform: translateY(6px); }
          100% { left: 105%; color: rgba(145, 145, 145, 0.26); transform: translateY(-8px); }
        }
        .animate-floatAcross5 {
          animation: floatAcross5 28s ease-in-out infinite;
          animation-delay: 6s;
        }
        
        @keyframes floatAcross6 {
          0% { left: -30px; color: rgba(255, 255, 255, 0.32); transform: translateY(0); }
          49% { color: rgba(255, 255, 255, 0.32); }
          50% { transform: translateY(-10px); }
          51% { color: rgba(155, 155, 155, 0.28); }
          100% { left: 105%; color: rgba(155, 155, 155, 0.28); transform: translateY(4px); }
        }
        .animate-floatAcross6 {
          animation: floatAcross6 18s ease-in-out infinite;
          animation-delay: 10s;
        }
        
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spinSlow {
          animation: spinSlow 10s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out forwards;
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 30px) scale(0.95); }
          75% { transform: translate(40px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 18s ease-in-out infinite;
        }
        
        .animation-delay-2000 { animation-delay: 2s; }
      `}} />
    </div>
  );
}