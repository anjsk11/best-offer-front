import { LogIn, UserPlus } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { api } from '../../api'
import type { Notice } from '../../types/ui'
import { toNotice } from '../../utils/notice'
import { saveStoredProfile, sessionStorageKey } from '../../utils/session'

type AccountPageProps = {
  onNotice: (notice: Notice | null) => void
}

export function AccountPage({ onNotice }: AccountPageProps) {
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    nickname: '',
  })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [sessionMessage, setSessionMessage] = useState(
    localStorage.getItem(sessionStorageKey) ?? '',
  )

  async function handleSignup(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.signup(signupForm)
      saveStoredProfile({
        email: signupForm.email,
        nickname: signupForm.nickname,
      })
      onNotice({
        tone: 'success',
        message: response || '회원가입이 완료되었습니다.',
      })
    } catch (error) {
      onNotice(toNotice('error', error))
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.login(loginForm)
      const message = response || `${loginForm.email} 로그인 완료`
      localStorage.setItem(sessionStorageKey, message)
      setSessionMessage(message)
      onNotice({ tone: 'success', message })
    } catch (error) {
      onNotice(toNotice('error', error))
    }
  }

  return (
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
              setSignupForm({ ...signupForm, nickname: event.target.value })
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
              setSignupForm({ ...signupForm, password: event.target.value })
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
        {sessionMessage && <p className="session-message">{sessionMessage}</p>}
      </form>
    </section>
  )
}
