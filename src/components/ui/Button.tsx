import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2
    font-semibold tracking-tight
    rounded-full border
    transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
  `;

  const variants = {
    primary: `
      bg-gray-900 text-white border-gray-900
      hover:bg-black hover:shadow-lg
      active:scale-[0.98]
    `,
    secondary: `
      bg-gray-100 text-gray-900 border-gray-100
      hover:bg-gray-200
      active:scale-[0.98]
    `,
    outline: `
      bg-transparent text-gray-700 border-gray-200
      hover:bg-gray-50 hover:border-gray-300
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-gray-600 border-transparent
      hover:bg-gray-100 hover:text-gray-900
      active:scale-[0.98]
    `,
    accent: `
      bg-[var(--primary)] text-white border-[var(--primary)]
      hover:bg-[var(--primary-dark)] hover:shadow-lg
      active:scale-[0.98]
    `
  };

  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shine Effect on Hover */}
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
      </span>

      {/* Content */}
      <span className="relative flex items-center gap-2">
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </span>
    </motion.button>
  );
};