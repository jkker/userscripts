/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/global" />

declare module 'hosted-git-info' {
  export type HostedGitInfo = {
    file(path: string): string
    bugs(): string
  }

  const hostedGitInfo: {
    fromUrl(url: string): HostedGitInfo | undefined
  }

  export default hostedGitInfo
}
