import type { Notice } from '../types/ui'

type NoticeBannerProps = {
  notice: Notice | null
}

export function NoticeBanner({ notice }: NoticeBannerProps) {
  if (!notice) return null

  return <p className={`notice ${notice.tone}`}>{notice.message}</p>
}
