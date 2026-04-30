import { CircleUserRound, Gavel, Home, PackagePlus, Search } from 'lucide-react'
import type { AppTab } from '../types/ui'

type AppHeaderProps = {
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
}

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <Gavel size={28} aria-hidden="true" />
        <div>
          <strong>Best Offer</strong>
          <span>희귀 물품 실시간 경매</span>
        </div>
      </div>
      <nav className="tabs" aria-label="주요 메뉴">
        <button
          className={activeTab === 'home' ? 'active' : ''}
          type="button"
          onClick={() => onTabChange('home')}
        >
          <Home size={17} aria-hidden="true" />홈
        </button>
        <button
          className={activeTab === 'auctions' ? 'active' : ''}
          type="button"
          onClick={() => onTabChange('auctions')}
        >
          <Search size={17} aria-hidden="true" />
          경매 탐색
        </button>
        <button
          className={activeTab === 'create' ? 'active' : ''}
          type="button"
          onClick={() => onTabChange('create')}
        >
          <PackagePlus size={17} aria-hidden="true" />
          경매 등록
        </button>
        <button
          className={activeTab === 'mypage' ? 'active' : ''}
          type="button"
          onClick={() => onTabChange('mypage')}
        >
          <CircleUserRound size={17} aria-hidden="true" />
          마이페이지
        </button>
      </nav>
    </header>
  )
}
