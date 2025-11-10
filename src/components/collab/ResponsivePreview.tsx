import { useMemo } from 'react';

type Viewport = 'mobile' | 'tablet' | 'desktop' | number; // number as custom width

interface Props {
  html: string;
  css: string;
  js: string;
  viewport?: Viewport;
}

const VIEWPORT_WIDTH: Record<'mobile' | 'tablet' | 'desktop', number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
};

export function ResponsivePreview({ html, css, js, viewport = 'desktop' }: Props) {
  const width = typeof viewport === 'number' ? viewport : VIEWPORT_WIDTH[viewport];
  const srcDoc = useMemo(() => {
    return `<!doctype html><html><head><meta charset=\"utf-8\" />\n<style>${css}</style></head><body>${html}\n<script>${js}<\/script></body></html>`;
  }, [html, css, js]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="border rounded-lg shadow-sm bg-white" style={{ width, height: Math.round(width * 0.62) }}>
        <iframe title="Preview" srcDoc={srcDoc} className="w-full h-full rounded-lg" />
      </div>
    </div>
  );
}

