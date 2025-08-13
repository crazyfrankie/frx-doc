import { Suspense } from 'react';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { Sidebar } from '../../components/Sidebar';
import { TableOfContents } from '../../components/TableOfContents';

interface DocsVersionPageProps {
  params: Promise<{ version: string }>;
}

export default async function DocsVersionPage({ params }: DocsVersionPageProps) {
  const { version } = await params;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <Sidebar currentVersion={version} />
        <main className="flex-1 px-6 py-8">
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