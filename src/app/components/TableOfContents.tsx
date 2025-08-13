"use client";

import { useEffect, useState } from "react";
import { getSection, TocItem } from "../../lib/docs";

interface TableOfContentsProps {
  version: string;
  sectionId?: string;
}

export function TableOfContents({ version, sectionId }: TableOfContentsProps) {
  const [sections, setSections] = useState<TocItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    if (sectionId) {
      // 获取特定section的TOC
      const sectionData = getSection(version, sectionId);
      if (sectionData) {
        setSections(sectionData.toc);
      }
    }
  }, [version, sectionId]);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0% -35% 0%",
        threshold: 0,
      }
    );

    // 等待内容渲染完成后再观察
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll(
        ".markdown-content h3, .markdown-content h4"
      );
      headings.forEach((heading) => observer.observe(heading));
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (sections.length === 0) {
    return (
      <div className="sticky top-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            On This Page
          </h3>
          <p className="text-sm text-gray-500">No subsections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-8">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          On This Page
        </h3>
        <nav>
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`block text-left text-sm transition-colors w-full py-1 px-2 rounded hover:bg-gray-100 ${
                    activeSection === section.id
                      ? "text-blue-600 font-medium bg-blue-50"
                      : "text-gray-600 hover:text-blue-600"
                  } ${section.level === 4 ? "ml-4" : ""}`}
                >
                  {section.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
