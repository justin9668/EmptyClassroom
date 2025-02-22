'use client';

import { BuildingsContent } from './components/BuildingsContent';
import { NotesTooltip } from './components/NotesTooltip';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 flex flex-col flex-1">
        <div className="max-w-[736px] mx-auto w-full flex flex-col flex-1">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center pt-12">Find an empty classroom</h1>
          <BuildingsContent />
          <footer className="mt-auto py-4 flex justify-center gap-6 bg-white/80 backdrop-blur-sm -mx-4 px-4">
            <NotesTooltip>
              <span className="text-gray-500 hover:text-gray-700 cursor-pointer">
                Notes
              </span>
            </NotesTooltip>
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer">Request Building</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
