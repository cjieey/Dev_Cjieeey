import { useState, useEffect, useRef } from 'react'
import styles from './Admin.module.css'

const STORAGE_KEY = 'portfolio_projects'
const PASS = 'celjie2026' // simple client-side gate

const EMPTY = { name:'', tags:'', desc:'', url:'', image:null, gradient:'linear-gradient(135deg,#D90101,#4A0404)', featured:false }

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [preview, setPreview] = useState(null)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    try { setProjects(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')) } catch {}
  }, [])

  const save = (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    setProjects(list)
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleImg = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { setForm(f => ({ ...f, image: ev.target.result })); setPreview(ev.target.result) }
    reader.readAsDataURL(file)
  }

  const submit = e => {
    e.preventDefault()
    const entry = {
      ...form,
      id: editing ?? `custom-${Date.now()}`,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    if (editing) {
      save(projects.map(p => p.id === editing ? entry : p))
      setEditing(null)
    } else {
      save([...projects, entry])
    }
    setForm(EMPTY); setPreview(null)
  }

  const edit = p => {
    setEditing(p.id)
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags })
    setPreview(p.image)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const del = id => { if (confirm('Delete this project?')) save(projects.filter(p => p.id !== id)) }
  const cancel = () => { setEditing(null); setForm(EMPTY); setPreview(null) }

  if (!auth) return (
    <div className={styles.login}>
      <h1>Admin Access</h1>
      <form onSubmit={e => { e.preventDefault(); if (pw === PASS) setAuth(true) }}>
        <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} autoFocus />
        <button type="submit">Enter</button>
      </form>
      <a href="/" className={styles.back}>← Back to portfolio</a>
    </div>
  )

  return (
    <div className={styles.admin}>
      <header className={styles.header}>
        <h1>Project Manager</h1>
        <div className={styles.headerRight}>
          {saved && <span className={styles.savedBadge}>✓ Saved</span>}
          <a href="/" className={styles.viewSite}>View site →</a>
        </div>
      </header>

      {/* Form */}
      <section className={styles.formSection}>
        <h2>{editing ? 'Edit Project' : 'Add New Project'}</h2>
        <form className={styles.form} onSubmit={submit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Project Name *</label>
              <input required value={form.name} onChange={set('name')} placeholder="My Awesome Project" />
            </div>
            <div className={styles.field}>
              <label>Tags (comma-separated)</label>
              <input value={form.tags} onChange={set('tags')} placeholder="React, Laravel, AI" />
            </div>
          </div>
          <div className={styles.field}>
            <label>Description *</label>
            <textarea required rows={3} value={form.desc} onChange={set('desc')} placeholder="What does this project do?" />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Link / URL</label>
              <input value={form.url} onChange={set('url')} placeholder="https://github.com/..." />
            </div>
            <div className={styles.field}>
              <label>Fallback Gradient</label>
              <input value={form.gradient} onChange={set('gradient')} placeholder="linear-gradient(...)" />
            </div>
          </div>

          {/* Image upload */}
          <div className={styles.field}>
            <label>Project Image (optional)</label>
            <div className={styles.imgUpload} onClick={() => fileRef.current.click()}>
              {preview
                ? <img src={preview} alt="preview" className={styles.imgPreview} />
                : <span>Click to upload image (JPG, PNG, WebP)</span>
              }
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{ display:'none' }} />
            {preview && <button type="button" className={styles.clearImg} onClick={() => { setPreview(null); setForm(f=>({...f,image:null})) }}>Remove image</button>}
          </div>

          <div className={styles.checkRow}>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={form.featured} onChange={set('featured')} />
              Featured (wide card)
            </label>
          </div>

          <div className={styles.formActions}>
            {editing && <button type="button" className={styles.cancelBtn} onClick={cancel}>Cancel</button>}
            <button type="submit" className={styles.saveBtn}>
              {editing ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </section>

      {/* Project list */}
      <section className={styles.listSection}>
        <h2>Custom Projects ({projects.length})</h2>
        {projects.length === 0
          ? <p className={styles.empty}>No custom projects yet. Add one above.</p>
          : (
            <div className={styles.list}>
              {projects.map(p => (
                <div key={p.id} className={styles.listItem}>
                  <div className={styles.listThumb}>
                    {p.image
                      ? <img src={p.image} alt={p.name} />
                      : <div style={{ background: p.gradient, width:'100%', height:'100%' }} />
                    }
                  </div>
                  <div className={styles.listInfo}>
                    <strong>{p.name}</strong>
                    <span>{Array.isArray(p.tags) ? p.tags.join(', ') : p.tags}</span>
                    <p>{p.desc?.slice(0, 80)}…</p>
                  </div>
                  <div className={styles.listActions}>
                    <button className={styles.editBtn} onClick={() => edit(p)}>Edit</button>
                    <button className={styles.delBtn} onClick={() => del(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </section>
    </div>
  )
}
