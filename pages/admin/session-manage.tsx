import { useState } from 'react'

export default function SessionManagePage() {
  const [userId, setUserId] = useState('')
  const [sessions, setSessions] = useState([])

  const fetchSessions = async () => {
    const res = await fetch(`/api/admin/session-manage?userId=${userId}`, {
      credentials: 'include', // ✅ 추가
    })
    if (res.ok) {
      const data = await res.json()
      setSessions(data.sessions)
    }
  }

  const deleteSession = async (sessionId: number) => {
    await fetch(`/api/admin/session-manage?userId=${userId}&sessionId=${sessionId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    fetchSessions() // refresh
  }

  const deleteAllSessions = async () => {
    await fetch(`/api/admin/session-manage?userId=${userId}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    setSessions([])
  }

  return (
    <div>
      <h1>세션 관리</h1>
      <input
        type="number"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="User ID"
      />
      <button onClick={fetchSessions}>세션 조회</button>

      {sessions.length > 0 && (
        <>
          <h2>세션 목록</h2>
          <ul>
            {sessions.map((session) => (
              <li key={session.id}>
                {`세션 ID: ${session.id}, 만료: ${session.expires_at}`}
                <button onClick={() => deleteSession(session.id)}>삭제</button>
              </li>
            ))}
          </ul>
          <button onClick={deleteAllSessions}>모든 세션 삭제</button>
        </>
      )}
    </div>
  )
}
