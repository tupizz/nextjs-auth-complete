import { FormEvent, useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [email, emailSet] = useState('')
  const [password, passwordSet] = useState('')

  const { signIn } = useContext(AuthContext)

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    await signIn({email, password})
  }

  return (
    <form onSubmit={submitForm} className={styles.container}>
      <input type="email" name="email" value={email} onChange={e => emailSet(e.target.value)} />
      <input type="password" name="password" value={password} onChange={e => passwordSet(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  )
}
