import type { Notice } from '../types/ui'

export function toNotice(tone: Notice['tone'], error: unknown): Notice {
  return {
    tone,
    message: error instanceof Error ? error.message : '요청에 실패했습니다.',
  }
}
