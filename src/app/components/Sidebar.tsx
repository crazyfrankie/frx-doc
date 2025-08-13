'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getVersions, getDocData } from '../../lib/docs';

interface SidebarProps {
  currentVersion?: string;
  currentSection?: string;
}

export function Sidebar({ currentVersion = 'v1.0', currentSection }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started', 'core-modules']));
  const [navigation, setNavigation] = useState<Array<{ id: string; title: string; href: string }>>([]);
  const versions = getVersions();

  useEffect(() => {
    const docData = getDocData(currentVersion);
    if (docData) {
      setNavigation(docData.navigation);
    }
  }, [currentVersion]);

  const navigationSections = [
    {
      title: 'Getting Started',
      items: navigation.filter(item => 
        ['installation', 'quick-start'].includes(item.id)
      )
    },
    {
      title: 'Core Modules',
      items: navigation.filter(item => 
        ['http-middleware-httpx', 'error-handling-errorx', 'logging-logs', 'id-generation-idgen', 'context-cache-ctxcache', 'language-extensions-lang'].includes(item.id)
      )
    },
    {
      title: 'Advanced',
      items: navigation.filter(item => 
        ['best-practices', 'configuration-options', 'contributing'].includes(item.id)
      )
    }
  ];

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <aside className="w-72 bg-gray-50 min-h-screen border-r border-gray-200">
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            frx
          </Link>
          <a 
            href="https://github.com/crazyfrankie/frx" 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200"
            title="View on GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
        
        {/* Version Selector */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Version</h3>
          <select 
            value={currentVersion}
            onChange={(e) => window.location.href = `/docs/${e.target.value}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {versions.map((version) => (
              <option key={version.id} value={version.id}>
                {version.label}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation */}
        <nav>
          {navigationSections.map((section) => {
            const sectionKey = section.title.toLowerCase().replace(/\s+/g, '-');
            const isExpanded = expandedSections.has(sectionKey);
            
            if (section.items.length === 0) return null;
            
            return (
              <div key={section.title} className="mb-4">
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors mb-2"
                >
                  <span>{section.title}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {isExpanded && (
                  <ul className="space-y-1 ml-2 border-l border-gray-200 pl-4">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className={`block text-sm transition-colors py-1 w-full text-left ${
                            currentSection === item.id
                              ? 'text-blue-600 font-medium'
                              : 'text-gray-600 hover:text-blue-600'
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="space-y-2">
            <a 
              href="https://github.com/crazyfrankie/frx" 
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a 
              href="#license" 
              className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              License
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}