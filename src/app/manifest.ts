import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RuralCare 360 — Closed-Loop Healthcare System',
    short_name: 'RuralCare 360',
    description: 'Closed-loop rural healthcare coordination platform connecting patients, health workers, and facilities.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#059669',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
