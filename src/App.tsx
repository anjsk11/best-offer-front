import { useState } from 'react'
import './App.css'
import { AppHeader } from './components/AppHeader'
import { Hero } from './components/Hero'
import { NoticeBanner } from './components/NoticeBanner'
import { AccountPage } from './features/account/AccountPage'
import { AuctionExplorer } from './features/auctions/AuctionExplorer'
import { CreateAuctionPage } from './features/auctions/CreateAuctionPage'
import type { AppTab, Notice } from './types/ui'

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('auctions')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleAuctionCreated() {
    setActiveTab('auctions')
    setRefreshKey((current) => current + 1)
  }

  return (
    <main className="shell">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <Hero />
      <NoticeBanner notice={notice} />

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

      {activeTab === 'account' && <AccountPage onNotice={setNotice} />}
    </main>
  )
}

export default App
