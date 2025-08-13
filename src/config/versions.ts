// 版本配置
// 按照你希望在下拉菜单中显示的顺序排列
export const VERSIONS = [
  {
    id: 'v0.0.2',
    label: 'v0.0.2',
    isLatest: true
  }
];

// 获取最新版本
export function getLatestVersion(): string {
  const latest = VERSIONS.find(v => v.isLatest);
  return latest ? latest.id : VERSIONS[0].id;
}

// 获取所有版本ID
export function getAvailableVersions(): string[] {
  return VERSIONS.map(v => v.id);
}

// 获取版本显示标签
export function getVersionLabel(versionId: string): string {
  const version = VERSIONS.find(v => v.id === versionId);
  return version ? version.label : versionId;
}