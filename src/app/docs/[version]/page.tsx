import { Suspense } from 'react';
import { Metadata } from 'next';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { Sidebar } from '../../components/Sidebar';
import { TableOfContents } from '../../components/TableOfContents';
import { getDocData } from '../../../lib/docs';

interface DocsVersionPageProps {
  params: Promise<{ version: string }>;
}

export async function generateMetadata({ params }: DocsVersionPageProps): Promise<Metadata> {
  const { version } = await params;
  const docData = getDocData(version);
  
  // 对于版本页面，如果有第一个section，使用其标题，否则使用默认标题
  const title = docData && docData.sections.length > 0 
    ? `${docData.sections[0].title} - frx` 
    : 'frx';
  
  return {
    title,
    description: "toolkits for go",
  };
}

export default async function DocsVersionPage({ params }: DocsVersionPageProps) {
  const { version } = await params;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <Sidebar currentVersion={version} />
        <main className="flex-1 ml-80 px-6 py-8">
          <div className="max-w-6xl mx-auto flex gap-8">
            <div className="flex-1 max-w-4xl">
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <MarkdownRenderer version={version} />
              </Suspense>
            </div>
            <div className="w-64 flex-shrink-0">
              <TableOfContents version={version} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}