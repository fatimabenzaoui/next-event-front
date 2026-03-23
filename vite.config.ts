import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/next-event-front/',
  plugins: [react()],
  build: {
    outDir: 'dist', // Dossier de sortie (par défaut pour Vite)
    emptyOutDir: true, // Nettoie le dossier avant chaque build
  },
});
