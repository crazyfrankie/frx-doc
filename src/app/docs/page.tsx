import { redirect } from 'next/navigation';
import { getLatestVersion, getDocData } from '../../lib/docs';

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