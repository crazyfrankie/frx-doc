import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getLatestVersion, getDocData } from '../../lib/docs';

export const metadata: Metadata = {
  title: 'frx',
  description: 'toolkits for go',
};

export default function DocsPage() {
  const latestVersion = getLatestVersion();
  const docData = getDocData(latestVersion);
  
  // 重定向到第一个section
  if (docData && docData.sections.length > 0) {
    redirect(`/docs/${latestVersion}/${docData.sections[0].id}`);
  }
  
  // 如果没有数据，重定向到默认版本的installation
  redirect(`/docs/${latestVersion}/installation`);
}