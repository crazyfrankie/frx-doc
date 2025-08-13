'use client';

import { useEffect, useState } from 'react';
import { getSection, DocSection } from '../../lib/docs';
import Prism from 'prismjs';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

interface SectionRendererProps {
  version: string;
  sectionId: string;
}

export function SectionRenderer({ version, sectionId }: SectionRendererProps) {
  const [section, setSection] = useState<DocSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      const sectionData = getSection(version, sectionId);
      
      if (!sectionData) {
        setError(`Section "${sectionId}" not found in version ${version}`);
      } else {
        setSection(sectionData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load section');
    } finally {
      setLoading(false);
    }
  }, [version, sectionId]);

  useEffect(() => {
    if (section) {
      // 延迟执行语法高亮，确保DOM已更新
      setTimeout(() => {
        Prism.highlightAll();
      }, 100);
    }
  }, [section]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading section...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Section not found</p>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h1>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full inline-block">
          Version: {version}
        </div>
      </div>
      
      <div 
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </div>
  );
}