import React from 'react';
import { TopNav } from './TopNav';
import { motion } from 'framer-motion';

export function PageShell({ children, title, description, actions }) {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <TopNav />
      <main className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {(title || actions) && (
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
              {description && <p className="mt-2 text-gray-500">{description}</p>}
            </div>
            {actions && <div className="flex-shrink-0">{actions}</div>}
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
