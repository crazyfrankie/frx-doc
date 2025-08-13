import docsData from '../data/docs.json';
import { VERSIONS, getLatestVersion as getConfigLatestVersion, getAvailableVersions as getConfigAvailableVersions, getVersionLabel } from '../config/versions';

export interface DocSection {
  id: string;
  title: string;
  content: string;
  level: number;
  toc: TocItem[];
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
}

export interface DocData {
  title: string;
  version: string;
  sections: DocSection[];
  navigation: NavItem[];
}

export interface VersionInfo {
  id: string;
  label: string;
  isLatest: boolean;
}

export function getDocData(version: string): DocData | null {
  return (docsData as Record<string, DocData>)[version] || null;
}

export function getSection(version: string, sectionId: string): DocSection | null {
  const docData = getDocData(version);
  if (!docData) return null;
  
  return docData.sections.find(section => section.id === sectionId) || null;
}

export function getAvailableVersions(): string[] {
  return getConfigAvailableVersions();
}

export function getLatestVersion(): string {
  return getConfigLatestVersion();
}

export function getVersions(): VersionInfo[] {
  return VERSIONS;
}

export { getVersionLabel };