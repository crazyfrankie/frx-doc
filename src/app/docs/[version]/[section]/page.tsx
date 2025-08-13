import { Suspense } from 'react';
import { SectionRenderer } from '../../../components/SectionRenderer';
import { Sidebar } from '../../../components/Sidebar';
import { TableOfContents } from '../../../components/TableOfContents';

interface DocsSectionPageProps {
  params: Promise<{ version: string; section: string }>;
}

export default async function DocsSectionPage({ params }: DocsSectionPageProps) {
  const { version, section } = await params;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <Sidebar currentVersion={version} currentSection={section} />
        <main className="flex-1 px-6 py-8">
          <div className="max-w-6xl mx-auto flex gap-8">
            <div className="flex-1 max-w-4xl">
              <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
                <SectionRenderer version={version} sectionId={section} />
              </Suspense>
            </div>
            <div className="w-64 flex-shrink-0">
              <TableOfContents version={version} sectionId={section} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}