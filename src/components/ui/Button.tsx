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

  // Updated variants to use Semantic Theme Colors
  const variants = {
    primary: `
      bg-primary text-primary-foreground border-primary
      hover:opacity-90 hover:shadow-lg
      active:scale-[0.98]
    `,
    secondary: `
      bg-secondary text-secondary-foreground border-secondary
      hover:bg-secondary/80
      active:scale-[0.98]
    `,
    outline: `
      bg-transparent text-foreground border-input
      hover:bg-accent hover:text-accent-foreground
      active:scale-[0.98]
    `,
    ghost: `
      bg-transparent text-muted-foreground border-transparent
      hover:bg-accent hover:text-accent-foreground
      active:scale-[0.98]
    `,
    accent: `
      bg-accent text-accent-foreground border-accent
      hover:bg-accent/80 hover:shadow-lg
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