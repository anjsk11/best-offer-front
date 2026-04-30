import { AccountPage } from '../account/AccountPage'
import type { Notice } from '../../types/ui'

type HomePageProps = {
  onNotice: (notice: Notice | null) => void
}

export function HomePage({ onNotice }: HomePageProps) {
  return (
    <section className="home-page">
      <div className="hero">
        <h1>당신의 가격을 만나는 곳, Best Offer</h1>
        <p>지금 입찰하거나 직접 물건을 올려, 가장 합리적인 가격을 찾으세요.</p>
      </div>
      <AccountPage onNotice={onNotice} />
    </section>
  )
}
