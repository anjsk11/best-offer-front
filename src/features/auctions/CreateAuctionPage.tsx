import { PackagePlus } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../../api'
import type { Notice } from '../../types/ui'
import { defaultEndTime } from '../../utils/forms'
import { toNotice } from '../../utils/notice'

type CreateAuctionPageProps = {
  onCreated: () => void
  onNotice: (notice: Notice | null) => void
}

export function CreateAuctionPage({
  onCreated,
  onNotice,
}: CreateAuctionPageProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    startPrice: '',
    endTime: defaultEndTime(),
  })

  async function handleCreate(event: FormEvent) {
    event.preventDefault()

    try {
      await api.createAuction({
        title: form.title.trim(),
        description: form.description.trim(),
        startPrice: Number(form.startPrice),
        endTime: new Date(form.endTime).toISOString(),
      })
      setForm({
        title: '',
        description: '',
        startPrice: '',
        endTime: defaultEndTime(),
      })
      onCreated()
      onNotice({ tone: 'success', message: '경매가 등록되었습니다.' })
    } catch (error) {
      onNotice(toNotice('error', error))
    }
  }

  return (
    <section className="single-column">
      <form className="panel create-panel" onSubmit={handleCreate}>
        <h2>새 경매 등록</h2>
        <div className="form-grid">
          <label>
            제목
            <input
              required
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
            />
          </label>
          <label>
            시작가
            <input
              min="0"
              required
              type="number"
              value={form.startPrice}
              onChange={(event) =>
                setForm({ ...form, startPrice: event.target.value })
              }
            />
          </label>
          <label>
            마감 시간
            <input
              required
              type="datetime-local"
              value={form.endTime}
              onChange={(event) =>
                setForm({ ...form, endTime: event.target.value })
              }
            />
          </label>
          <label className="wide">
            설명
            <textarea
              required
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
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
  )
}
