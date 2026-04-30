import { useState } from 'react'
import './App.css'
import { AppHeader } from './components/AppHeader'
import { NoticeBanner } from './components/NoticeBanner'
import { AuctionExplorer } from './features/auctions/AuctionExplorer'
import { CreateAuctionPage } from './features/auctions/CreateAuctionPage'
import { HomePage } from './features/home/HomePage'
import { MyPage } from './features/mypage/MyPage'
import type { AppTab, Notice } from './types/ui'

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleAuctionCreated() {
    setActiveTab('auctions')
    setRefreshKey((current) => current + 1)
  }

  return (
    <main className="shell">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <NoticeBanner notice={notice} />

      {activeTab === 'home' && <HomePage onNotice={setNotice} />}

      {activeTab === 'auctions' && (
        <AuctionExplorer
          onNotice={setNotice}
          refreshKey={refreshKey}
        />
      )}

      {activeTab === 'create' && (
        <CreateAuctionPage
          onCreated={handleAuctionCreated}
          onNotice={setNotice}
        />
      )}

      {activeTab === 'mypage' && <MyPage />}
    </main>
  )
}

export default App
