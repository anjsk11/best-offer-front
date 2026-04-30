import { CircleUserRound } from 'lucide-react'
import { readStoredProfile } from '../../utils/session'

export function MyPage() {
  const profile = readStoredProfile()
  const nickname = profile?.nickname || '닉네임 정보가 없습니다'

  return (
    <section className="single-column mypage">
      <article className="panel profile-card">
        <div className="profile-icon" aria-hidden="true">
          <CircleUserRound size={34} />
        </div>
        <div>
          <p className="eyebrow">마이페이지</p>
          <h2>{nickname}</h2>
        </div>
      </article>
    </section>
  )
}
