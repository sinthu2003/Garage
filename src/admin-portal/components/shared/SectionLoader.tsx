/**
 * ============================================
 * SECTION LOADER COMPONENT
 * ============================================
 * 
 * Shows loading spinner while section data is being fetched.
 * 
 * @file src/admin-portal/components/shared/SectionLoader.tsx
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface SectionLoaderProps {
  section?: string;
  message?: string;
}

export const SectionLoader: React.FC<SectionLoaderProps> = ({
  section,
  message,
}) => {
  const displayMessage = message || (section ? `Loading ${section}...` : 'Loading...');

  return (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
      <p className="text-sm text-muted-foreground">{displayMessage}</p>
    </div>
  );
};

export default SectionLoader;