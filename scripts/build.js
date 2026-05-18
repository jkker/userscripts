import { spawnSync } from 'node:child_process'

import { scripts } from '#/scripts.ts'

for (const { slug } of scripts) {
  const result = spawnSync('vp', ['build', '--mode', slug], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (result.status !== 0) process.exit(result.status ?? 1)
}
