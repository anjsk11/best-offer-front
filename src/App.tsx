import {
  BadgePlus,
  Clock3,
  Gavel,
  Loader2,
  LogIn,
  PackagePlus,
  Pencil,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'
import {
  api,
  type AuctionDetail,
  type AuctionListItem,
  type BidHistoryItem,
  type PageResponse,
} from './api'

const money = new Intl.NumberFormat('ko-KR')
const dateTime = new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const statusLabels = {
  ON_SALE: '진행중',
  COMPLETED: '종료',
  DELETED: '삭제됨',
}

type Notice = {
  tone: 'success' | 'error' | 'info'
  message: string
}

type Tab = 'auctions' | 'create' | 'account'

const emptyPage: PageResponse<AuctionListItem> = {
  content: [],
  empty: true,
  first: true,
  last: true,
  number: 0,
  numberOfElements: 0,
  size: 8,
  totalElements: 0,
  totalPages: 0,
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('auctions')
  const [page, setPage] = useState(0)
  const [auctions, setAuctions] =
    useState<PageResponse<AuctionListItem>>(emptyPage)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<AuctionDetail | null>(null)
  const [bids, setBids] = useState<BidHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    startPrice: '',
    endTime: defaultEndTime(),
  })
  const [editForm, setEditForm] = useState({ title: '', description: '' })
  const [bidForm, setBidForm] = useState({ bidPrice: '', bidderId: '' })
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    nickname: '',
  })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [sessionMessage, setSessionMessage] = useState(
    localStorage.getItem('best-offer-session') ?? '',
  )

  const selectedAuction = useMemo(
    () => auctions.content.find((auction) => auction.id === selectedId),
    [auctions.content, selectedId],
  )

  const loadAuctions = useCallback(async (nextPage = 0) => {
    setLoading(true)
    try {
      const response = await api.getAuctions(nextPage)
      setAuctions(response)
      setNotice(null)
      setSelectedId((current) => current ?? response.content[0]?.id ?? null)
    } catch (error) {
      setNotice(toNotice('error', error))
    } finally {
      setLoading(false)
    }
  }, [])

  const loadAuctionDetail = useCallback(async (auctionId: number) => {
    setDetailLoading(true)
    try {
      const [auction, history] = await Promise.all([
        api.getAuction(auctionId),
        api.getBidHistory(auctionId),
      ])
      setDetail(auction)
      setEditForm({
        title: auction.title,
        description: auction.description,
      })
      setBidForm((current) => ({
        ...current,
        bidPrice: String(auction.currentPrice + 1000),
      }))
      setBids(history.content)
    } catch (error) {
      setNotice(toNotice('error', error))
    } finally {
      setDetailLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAuctions(page)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadAuctions, page])

  useEffect(() => {
    if (selectedId !== null) {
      const timer = window.setTimeout(() => {
        void loadAuctionDetail(selectedId)
      }, 0)

      return () => window.clearTimeout(timer)
    }

    return undefined
  }, [loadAuctionDetail, selectedId])

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    try {
      await api.createAuction({
        title: createForm.title.trim(),
        description: createForm.description.trim(),
        startPrice: Number(createForm.startPrice),
        endTime: new Date(createForm.endTime).toISOString(),
      })
      setCreateForm({
        title: '',
        description: '',
        startPrice: '',
        endTime: defaultEndTime(),
      })
      setActiveTab('auctions')
      setPage(0)
      await loadAuctions(0)
      setNotice({ tone: 'success', message: '경매가 등록되었습니다.' })
    } catch (error) {
      setNotice(toNotice('error', error))
    }
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault()
    if (!detail) return

    try {
      await api.updateAuction(detail.id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
      })
      await Promise.all([loadAuctions(page), loadAuctionDetail(detail.id)])
      setNotice({ tone: 'success', message: '경매 정보가 수정되었습니다.' })
    } catch (error) {
      setNotice(toNotice('error', error))
    }
  }

  async function handleDelete() {
    if (!detail) return
    if (!confirm(`'${detail.title}' 경매를 삭제할까요?`)) return

    try {
      await api.deleteAuction(detail.id)
      setSelectedId(null)
      setDetail(null)
      setBids([])
      await loadAuctions(page)
      setNotice({ tone: 'success', message: '경매가 삭제되었습니다.' })
    } catch (error) {
      setNotice(toNotice('error', error))
    }
  }

  async function handleBid(event: FormEvent) {
    event.preventDefault()
    if (!detail) return

    try {
      await api.placeBid(detail.id, {
        bidPrice: Number(bidForm.bidPrice),
        bidderId: Number(bidForm.bidderId),
      })
      await Promise.all([loadAuctions(page), loadAuctionDetail(detail.id)])
      setNotice({ tone: 'success', message: '입찰이 완료되었습니다.' })
    } catch (error) {
      setNotice(toNotice('error', error))
    }
  }

  async function handleSignup(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await api.signup(signupForm)
      setNotice({
        tone: 'success',
        message: response || '회원가입이 완료되었습니다.',
      })
    } catch (error) {
      setNotice(toNotice('error', error))
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await api.login(loginForm)
      const message = response || `${loginForm.email} 로그인 완료`
      localStorage.setItem('best-offer-session', message)
      setSessionMessage(message)
      setNotice({ tone: 'success', message })
    } catch (error) {
      setNotice(toNotice('error', error))
    }
  }

  return (
    <main className="shell">
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
            className={activeTab === 'auctions' ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab('auctions')}
          >
            <Search size={17} aria-hidden="true" />
            경매 탐색
          </button>
          <button
            className={activeTab === 'create' ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab('create')}
          >
            <PackagePlus size={17} aria-hidden="true" />
            경매 등록
          </button>
          <button
            className={activeTab === 'account' ? 'active' : ''}
            type="button"
            onClick={() => setActiveTab('account')}
          >
            <ShieldCheck size={17} aria-hidden="true" />
            계정
          </button>
        </nav>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Spring API: 43.201.197.227:8080</p>
          <h1>가치 있는 물건에 가장 좋은 제안을 남기세요.</h1>
        </div>
        <div className="hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=720&q=80"
            alt=""
          />
        </div>
      </section>

      {notice && <p className={`notice ${notice.tone}`}>{notice.message}</p>}

      {activeTab === 'auctions' && (
        <section className="workspace">
          <div className="panel auction-list">
            <div className="panel-heading">
              <div>
                <h2>경매 목록</h2>
                <p>{money.format(auctions.totalElements)}개 항목</p>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="목록 새로고침"
                onClick={() => void loadAuctions(page)}
              >
                {loading ? (
                  <Loader2 className="spin" size={18} aria-hidden="true" />
                ) : (
                  <RefreshCw size={18} aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="auction-items">
              {auctions.content.map((auction) => (
                <button
                  className={`auction-row ${
                    auction.id === selectedId ? 'selected' : ''
                  }`}
                  key={auction.id}
                  type="button"
                  onClick={() => setSelectedId(auction.id)}
                >
                  <span>
                    <strong>{auction.title}</strong>
                    <small>{formatDate(auction.endTime)}</small>
                  </span>
                  <span>
                    <b>{money.format(auction.currentPrice)}원</b>
                    <i className={`status ${auction.status.toLowerCase()}`}>
                      {statusLabels[auction.status]}
                    </i>
                  </span>
                </button>
              ))}
              {!loading && auctions.content.length === 0 && (
                <div className="empty">등록된 경매가 없습니다.</div>
              )}
            </div>

            <div className="pagination">
              <button
                type="button"
                disabled={auctions.first || loading}
                onClick={() => setPage((current) => current - 1)}
              >
                이전
              </button>
              <span>
                {auctions.totalPages === 0 ? 0 : auctions.number + 1} /{' '}
                {auctions.totalPages}
              </span>
              <button
                type="button"
                disabled={auctions.last || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                다음
              </button>
            </div>
          </div>

          <div className="detail-area">
            {detailLoading && (
              <div className="panel loading-panel">
                <Loader2 className="spin" size={24} aria-hidden="true" />
                불러오는 중
              </div>
            )}

            {!detailLoading && detail && (
              <>
                <article className="panel detail-card">
                  <div className="detail-top">
                    <div>
                      <i className={`status ${detail.status.toLowerCase()}`}>
                        {statusLabels[detail.status]}
                      </i>
                      <h2>{detail.title}</h2>
                      <p>{detail.description}</p>
                    </div>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => void handleDelete()}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      삭제
                    </button>
                  </div>

                  <dl className="metrics">
                    <div>
                      <dt>현재가</dt>
                      <dd>{money.format(detail.currentPrice)}원</dd>
                    </div>
                    <div>
                      <dt>시작가</dt>
                      <dd>{money.format(detail.startPrice)}원</dd>
                    </div>
                    <div>
                      <dt>판매자</dt>
                      <dd>{detail.sellerNickname}</dd>
                    </div>
                    <div>
                      <dt>마감</dt>
                      <dd>{formatDate(detail.endTime)}</dd>
                    </div>
                  </dl>
                </article>

                <div className="side-by-side">
                  <form className="panel form-panel" onSubmit={handleBid}>
                    <h3>
                      <BadgePlus size={18} aria-hidden="true" />
                      입찰하기
                    </h3>
                    <label>
                      입찰가
                      <input
                        min={detail.currentPrice + 1}
                        required
                        type="number"
                        value={bidForm.bidPrice}
                        onChange={(event) =>
                          setBidForm({
                            ...bidForm,
                            bidPrice: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      입찰자 ID
                      <input
                        min="1"
                        required
                        type="number"
                        value={bidForm.bidderId}
                        onChange={(event) =>
                          setBidForm({
                            ...bidForm,
                            bidderId: event.target.value,
                          })
                        }
                      />
                    </label>
                    <button className="primary-button" type="submit">
                      <Gavel size={17} aria-hidden="true" />
                      제안 제출
                    </button>
                  </form>

                  <form className="panel form-panel" onSubmit={handleUpdate}>
                    <h3>
                      <Pencil size={18} aria-hidden="true" />
                      경매 수정
                    </h3>
                    <label>
                      제목
                      <input
                        required
                        value={editForm.title}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            title: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label>
                      설명
                      <textarea
                        required
                        value={editForm.description}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            description: event.target.value,
                          })
                        }
                      />
                    </label>
                    <button className="secondary-button" type="submit">
                      저장
                    </button>
                  </form>
                </div>

                <section className="panel bid-history">
                  <div className="panel-heading">
                    <div>
                      <h2>입찰 내역</h2>
                      <p>{selectedAuction?.title ?? detail.title}</p>
                    </div>
                    <Clock3 size={18} aria-hidden="true" />
                  </div>
                  <ul>
                    {bids.map((bid) => (
                      <li key={bid.bidId}>
                        <span>{bid.bidderNickname}</span>
                        <strong>{money.format(bid.bidPrice)}원</strong>
                        <small>{formatDate(bid.bidTime)}</small>
                      </li>
                    ))}
                  </ul>
                  {bids.length === 0 && (
                    <div className="empty">아직 입찰 내역이 없습니다.</div>
                  )}
                </section>
              </>
            )}
          </div>
        </section>
      )}

      {activeTab === 'create' && (
        <section className="single-column">
          <form className="panel create-panel" onSubmit={handleCreate}>
            <h2>새 경매 등록</h2>
            <div className="form-grid">
              <label>
                제목
                <input
                  required
                  value={createForm.title}
                  onChange={(event) =>
                    setCreateForm({ ...createForm, title: event.target.value })
                  }
                />
              </label>
              <label>
                시작가
                <input
                  min="0"
                  required
                  type="number"
                  value={createForm.startPrice}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      startPrice: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                마감 시간
                <input
                  required
                  type="datetime-local"
                  value={createForm.endTime}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      endTime: event.target.value,
                    })
                  }
                />
              </label>
              <label className="wide">
                설명
                <textarea
                  required
                  value={createForm.description}
                  onChange={(event) =>
                    setCreateForm({
                      ...createForm,
                      description: event.target.value,
                    })
                  }
                />
              </label>
            </div>
            <button className="primary-button" type="submit">
              <PackagePlus size={17} aria-hidden="true" />
              등록
            </button>
          </form>
        </section>
      )}

      {activeTab === 'account' && (
        <section className="account-grid">
          <form className="panel form-panel" onSubmit={handleSignup}>
            <h2>
              <UserPlus size={19} aria-hidden="true" />
              회원가입
            </h2>
            <label>
              이메일
              <input
                required
                type="email"
                value={signupForm.email}
                onChange={(event) =>
                  setSignupForm({ ...signupForm, email: event.target.value })
                }
              />
            </label>
            <label>
              닉네임
              <input
                required
                value={signupForm.nickname}
                onChange={(event) =>
                  setSignupForm({
                    ...signupForm,
                    nickname: event.target.value,
                  })
                }
              />
            </label>
            <label>
              비밀번호
              <input
                required
                type="password"
                value={signupForm.password}
                onChange={(event) =>
                  setSignupForm({
                    ...signupForm,
                    password: event.target.value,
                  })
                }
              />
            </label>
            <button className="primary-button" type="submit">
              가입
            </button>
          </form>

          <form className="panel form-panel" onSubmit={handleLogin}>
            <h2>
              <LogIn size={19} aria-hidden="true" />
              로그인
            </h2>
            <label>
              이메일
              <input
                required
                type="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm({ ...loginForm, email: event.target.value })
                }
              />
            </label>
            <label>
              비밀번호
              <input
                required
                type="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm({ ...loginForm, password: event.target.value })
                }
              />
            </label>
            <button className="primary-button" type="submit">
              로그인
            </button>
            {sessionMessage && (
              <p className="session-message">{sessionMessage}</p>
            )}
          </form>
        </section>
      )}
    </main>
  )
}

function toNotice(tone: Notice['tone'], error: unknown): Notice {
  return {
    tone,
    message: error instanceof Error ? error.message : '요청에 실패했습니다.',
  }
}

function formatDate(value: string) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return dateTime.format(date)
}

function defaultEndTime() {
  const date = new Date()
  date.setDate(date.getDate() + 7)
  date.setMinutes(0, 0, 0)
  return date.toISOString().slice(0, 16)
}

export default App
