/**
 * ============================================
 * SHARED DROPDOWN COMPONENT
 * ============================================
 * A flexible, reusable dropdown component with:
 * - Single & multi-select support
 * - Search/filter functionality
 * - Keyboard navigation
 * - Custom option rendering
 * - Multiple variants
 * - Loading & error states
 * 
 * @file src/shared/components/Dropdown.tsx
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Check,
  Search,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface DropdownOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  group?: string;
}

export interface DropdownProps {
  /** Array of options to display */
  options: DropdownOption[];
  /** Selected value(s) */
  value?: string | number | (string | number)[];
  /** Callback when value changes */
  onChange?: (value: string | number | (string | number)[]) => void;
  /** Placeholder text when no selection */
  placeholder?: string;
  /** Label for the dropdown */
  label?: string;
  /** Helper text below the dropdown */
  helperText?: string;
  /** Error message */
  error?: string;
  /** Enable multi-select */
  multiple?: boolean;
  /** Enable search/filter */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Enable clear button */
  clearable?: boolean;
  /** Disable the dropdown */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Dropdown size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Dropdown style variant */
  variant?: 'default' | 'outlined' | 'filled' | 'ghost';
  /** Full width dropdown */
  fullWidth?: boolean;
  /** Custom class names */
  className?: string;
  /** Dropdown menu position */
  position?: 'bottom' | 'top' | 'auto';
  /** Maximum height of dropdown menu */
  maxHeight?: number;
  /** Custom render for selected value */
  renderValue?: (selected: DropdownOption | DropdownOption[]) => React.ReactNode;
  /** Custom render for option */
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  /** No options message */
  noOptionsMessage?: string;
  /** Called when dropdown opens */
  onOpen?: () => void;
  /** Called when dropdown closes */
  onClose?: () => void;
  /** ID for accessibility */
  id?: string;
  /** Name attribute */
  name?: string;
  /** Required field */
  required?: boolean;
}

export interface DropdownRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
  focus: () => void;
}

// ============================================
// ANIMATION VARIANTS
// ============================================

const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.15 },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 500, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.1 },
  },
};

const optionVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.02, type: 'tween' as const },
  }),
};

// ============================================
// SIZE CONFIGURATIONS
// ============================================

const sizeConfig = {
  sm: {
    trigger: 'h-9 px-3 text-sm',
    option: 'px-3 py-2 text-sm',
    icon: 16,
    gap: 'gap-2',
  },
  md: {
    trigger: 'h-11 px-4 text-sm',
    option: 'px-4 py-2.5 text-sm',
    icon: 18,
    gap: 'gap-2.5',
  },
  lg: {
    trigger: 'h-12 px-4 text-base',
    option: 'px-4 py-3 text-base',
    icon: 20,
    gap: 'gap-3',
  },
};

// ============================================
// VARIANT CONFIGURATIONS
// ============================================

const variantConfig = {
  default: {
    trigger: `bg-card border border-border hover:border-primary/50 focus:border-primary 
      focus:ring-2 focus:ring-primary/20`,
    menu: 'bg-card border border-border',
  },
  outlined: {
    trigger: `bg-transparent border-2 border-border hover:border-primary/50 focus:border-primary 
      focus:ring-2 focus:ring-primary/20`,
    menu: 'bg-card border-2 border-border',
  },
  filled: {
    trigger: `bg-secondary/50 border border-transparent hover:bg-secondary/70 focus:bg-secondary/70 
      focus:ring-2 focus:ring-primary/20`,
    menu: 'bg-card border border-border',
  },
  ghost: {
    trigger: `bg-transparent border border-transparent hover:bg-secondary/50 focus:bg-secondary/50 
      focus:ring-2 focus:ring-primary/20`,
    menu: 'bg-card border border-border',
  },
};

// ============================================
// DROPDOWN COMPONENT
// ============================================

export const Dropdown = forwardRef<DropdownRef, DropdownProps>(
  (
    {
      options = [],
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      helperText,
      error,
      multiple = false,
      searchable = false,
      searchPlaceholder = 'Search...',
      clearable = false,
      disabled = false,
      loading = false,
      size = 'md',
      variant = 'default',
      fullWidth = false,
      className = '',
      position = 'auto',
      maxHeight = 280,
      renderValue,
      renderOption,
      noOptionsMessage = 'No options found',
      onOpen,
      onClose,
      id,
      name,
      required = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const sizes = sizeConfig[size];
    const variants = variantConfig[variant];

    // ============================================
    // COMPUTED VALUES
    // ============================================

    const selectedValues = useMemo(() => {
      if (value === undefined || value === null) return [];
      return Array.isArray(value) ? value : [value];
    }, [value]);

    const selectedOptions = useMemo(() => {
      return options.filter((opt) => selectedValues.includes(opt.value));
    }, [options, selectedValues]);

    const filteredOptions = useMemo(() => {
      if (!searchQuery.trim()) return options;
      const query = searchQuery.toLowerCase();
      return options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(query) ||
          opt.description?.toLowerCase().includes(query)
      );
    }, [options, searchQuery]);

    const groupedOptions = useMemo(() => {
      const groups: Record<string, DropdownOption[]> = {};
      filteredOptions.forEach((opt) => {
        const group = opt.group || '';
        if (!groups[group]) groups[group] = [];
        groups[group].push(opt);
      });
      return groups;
    }, [filteredOptions]);

    // ============================================
    // HANDLERS
    // ============================================

    const calculatePosition = useCallback(() => {
      if (position !== 'auto' || !containerRef.current) {
        setDropdownPosition(position === 'top' ? 'top' : 'bottom');
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      setDropdownPosition(spaceBelow < maxHeight && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }, [position, maxHeight]);

    const openDropdown = useCallback(() => {
      if (disabled || loading) return;
      calculatePosition();
      setIsOpen(true);
      setHighlightedIndex(-1);
      onOpen?.();
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }, [disabled, loading, calculatePosition, onOpen]);

    const closeDropdown = useCallback(() => {
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
      onClose?.();
    }, [onClose]);

    const toggleDropdown = useCallback(() => {
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }, [isOpen, openDropdown, closeDropdown]);

    const handleSelect = useCallback(
      (option: DropdownOption) => {
        if (option.disabled) return;

        if (multiple) {
          const newValues = selectedValues.includes(option.value)
            ? selectedValues.filter((v) => v !== option.value)
            : [...selectedValues, option.value];
          onChange?.(newValues);
        } else {
          onChange?.(option.value);
          closeDropdown();
        }
      },
      [multiple, selectedValues, onChange, closeDropdown]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(multiple ? [] : '');
      },
      [multiple, onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled || loading) return;

        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (!isOpen) {
              openDropdown();
            } else if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex]);
            }
            break;
          case 'Escape':
            e.preventDefault();
            closeDropdown();
            triggerRef.current?.focus();
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (!isOpen) {
              openDropdown();
            } else {
              setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0
              );
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (!isOpen) {
              openDropdown();
            } else {
              setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1
              );
            }
            break;
          case 'Tab':
            if (isOpen) {
              closeDropdown();
            }
            break;
        }
      },
      [disabled, loading, isOpen, highlightedIndex, filteredOptions, openDropdown, closeDropdown, handleSelect]
    );

    // ============================================
    // EFFECTS
    // ============================================

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          closeDropdown();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, closeDropdown]);

    useEffect(() => {
      if (isOpen && highlightedIndex >= 0 && menuRef.current) {
        const highlightedElement = menuRef.current.querySelector(
          `[data-index="${highlightedIndex}"]`
        );
        highlightedElement?.scrollIntoView({ block: 'nearest' });
      }
    }, [isOpen, highlightedIndex]);

    // ============================================
    // IMPERATIVE HANDLE
    // ============================================

    useImperativeHandle(ref, () => ({
      open: openDropdown,
      close: closeDropdown,
      toggle: toggleDropdown,
      focus: () => triggerRef.current?.focus(),
    }));

    // ============================================
    // RENDER HELPERS
    // ============================================

    const renderSelectedValue = () => {
      if (selectedOptions.length === 0) {
        return <span className="text-muted-foreground">{placeholder}</span>;
      }

      if (renderValue) {
        return renderValue(multiple ? selectedOptions : selectedOptions[0]);
      }

      if (multiple) {
        return (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.slice(0, 2).map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 
                  text-primary rounded-md text-xs font-medium"
              >
                {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                {opt.label}
              </span>
            ))}
            {selectedOptions.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 bg-secondary 
                text-muted-foreground rounded-md text-xs font-medium">
                +{selectedOptions.length - 2} more
              </span>
            )}
          </div>
        );
      }

      const selected = selectedOptions[0];
      return (
        <span className="flex items-center gap-2 truncate">
          {selected.icon && <span className="flex-shrink-0">{selected.icon}</span>}
          <span className="truncate">{selected.label}</span>
        </span>
      );
    };

    const renderOptionItem = (option: DropdownOption, index: number) => {
      const isSelected = selectedValues.includes(option.value);
      const isHighlighted = highlightedIndex === index;

      if (renderOption) {
        return (
          <div
            key={option.value}
            data-index={index}
            onClick={() => handleSelect(option)}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={`cursor-pointer ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {renderOption(option, isSelected)}
          </div>
        );
      }

      return (
        <motion.div
          key={option.value}
          data-index={index}
          variants={optionVariants}
          initial="hidden"
          animate="visible"
          custom={index}
          onClick={() => handleSelect(option)}
          onMouseEnter={() => setHighlightedIndex(index)}
          className={`
            flex items-center justify-between ${sizes.option} rounded-lg cursor-pointer
            transition-colors duration-150
            ${isHighlighted ? 'bg-primary/10' : 'hover:bg-secondary/60'}
            ${isSelected ? 'text-primary font-medium' : 'text-foreground'}
            ${option.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
          `}
        >
          <div className={`flex items-center ${sizes.gap} flex-1 min-w-0`}>
            {option.icon && (
              <span className="flex-shrink-0 text-muted-foreground">{option.icon}</span>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate">{option.label}</p>
              {option.description && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </div>
          {isSelected && (
            <Check size={sizes.icon} className="flex-shrink-0 text-primary ml-2" />
          )}
        </motion.div>
      );
    };

    // ============================================
    // RENDER
    // ============================================

    return (
      <div
        ref={containerRef}
        className={`relative ${fullWidth ? 'w-full' : 'w-64'} ${className}`}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* Trigger Button */}
        <button
          ref={triggerRef}
          id={id}
          name={name}
          type="button"
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${id}-label` : undefined}
          className={`
            relative w-full flex items-center justify-between ${sizes.trigger} ${sizes.gap}
            rounded-xl font-medium transition-all duration-200 outline-none
            ${variants.trigger}
            ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <span className="flex-1 text-left truncate">{renderSelectedValue()}</span>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {loading && (
              <Loader2 size={sizes.icon} className="animate-spin text-muted-foreground" />
            )}
            {clearable && selectedOptions.length > 0 && !disabled && !loading && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                type="button"
                onClick={handleClear}
                className="p-0.5 rounded-full hover:bg-secondary text-muted-foreground 
                  hover:text-foreground transition-colors"
              >
                <X size={sizes.icon - 2} />
              </motion.button>
            )}
            <ChevronDown
              size={sizes.icon}
              className={`text-muted-foreground transition-transform duration-200 
                ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={menuRef}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="listbox"
              aria-multiselectable={multiple}
              className={`
                absolute z-50 w-full rounded-xl shadow-xl overflow-hidden
                ${variants.menu}
                ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
              `}
              style={{ maxHeight }}
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search
                      size={sizes.icon}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={searchPlaceholder}
                      className={`
                        w-full ${sizes.trigger} pl-10 pr-4 bg-secondary/50 border border-border 
                        rounded-lg text-foreground placeholder:text-muted-foreground
                        focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                      `}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground 
                          hover:text-foreground transition-colors"
                      >
                        <X size={sizes.icon - 2} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div
                className="overflow-y-auto p-2"
                style={{ maxHeight: searchable ? maxHeight - 60 : maxHeight - 16 }}
              >
                {filteredOptions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <AlertCircle size={24} className="mb-2 opacity-50" />
                    <p className="text-sm">{noOptionsMessage}</p>
                  </div>
                ) : (
                  Object.entries(groupedOptions).map(([group, groupOptions]) => (
                    <div key={group || 'default'}>
                      {group && (
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground 
                          uppercase tracking-wider">
                          {group}
                        </div>
                      )}
                      <div className="space-y-0.5">
                        {groupOptions.map((option) => {
                          const globalIndex = filteredOptions.findIndex(
                            (o) => o.value === option.value
                          );
                          return renderOptionItem(option, globalIndex);
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text / Error */}
        {(helperText || error) && (
          <p
            className={`mt-1.5 text-xs ${
              error ? 'text-destructive' : 'text-muted-foreground'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;