;(async () => {
  const $ = id => document.getElementById(id)
  const msgs = $('messages')
  const input = $('user-input')
  const sendBtn = $('send-btn')
  const statusText = $('status-text')
  const settingsPanel = $('settings-panel')
  const settingsBtn = $('settings-btn')

  let history = []
    let cfg = {}
      let busy = false

  function addMsg(role, text) {
    const div = document.createElement('div')
    div.className = 'msg ' + role
    div.textContent = text
    msgs.appendChild(div)
    msgs.scrollTop = msgs.scrollHeight
  }

  function showTyping() {
    const div = document.createElement('div')
    div.className = 'msg lily'
    div.id = 'typing-indicator'
    div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>'
    msgs.appendChild(div)
    msgs.scrollTop = msgs.scrollHeight
  }

  function hideTyping() {
    const el = $('typing-indicator')
    if (el) el.remove()
  }

  function setStatus(text) { statusText.textContent = text }

  async function sendMessage() {
    if (busy) return
    const text = input.value.trim()
    if (!text) return
    input.value = ''
    input.style.height = 'auto'
    addMsg('user', text)
    history.push({ role: 'user', content: text })
    busy = true
    setStatus('Thinking...')
    showTyping()
    try {
      const result = await window.lily.chat(history)
      hideTyping()
      if (result.ok) {
        addMsg('lily', result.reply)
        history.push({ role: 'assistant', content: result.reply })
      } else {
        addMsg('system', 'Error: ' + result.error)
      }
    } catch (e) {
      hideTyping()
      addMsg('system', 'Something went wrong. Please try again.')
    }
    busy = false
    setStatus('Ready')
  };(async () => {
    let config = {}
    let history = []

    const messagesEl = document.getElementById('messages')
    const inputEl = document.getElementById('user-input')
    const sendBtn = document.getElementById('send-btn')
    const statusEl = document.getElementById('status-text')
    const settingsBtn = document.getElementById('settings-btn')
    const settingsPanel = document.getElementById('settings-panel')
    const saveSettingsBtn = document.getElementById('save-settings-btn')
    const closeSettingsBtn = document.getElementById('close-settings-btn')
    const btnClose = document.getElementById('btn-close')
    const btnMinimize = document.getElementById('btn-minimize')

    btnClose?.addEventListener('click', () => window.close())
    btnMinimize?.addEventListener('click', () => {})

    try { config = await window.lily.loadSettings() } catch (e) { console.warn(e) }

    function setStatus(t) { if (statusEl) statusEl.textContent = t }

    function addMessage(role, text) {
      const div = document.createElement('div')
      div.className = 'msg ' + role
      div.textContent = text
      messagesEl.appendChild(div)
      messagesEl.scrollTop = messagesEl.scrollHeight
      return div
    }

    function showTyping() {
      const div = document.createElement('div')
      div.className = 'msg lily'
      div.id = 'typing-indicator'
      div.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>'
      messagesEl.appendChild(div)
      messagesEl.scrollTop = messagesEl.scrollHeight
    }

    function removeTyping() {
      const el = document.getElementById('typing-indicator')
      if (el) el.remove()
    }

    async function sendMessage() {
      const text = inputEl.value.trim()
      if (!text) return
      addMessage('user', text)
      history.push({ role: 'user', content: text })
      inputEl.value = ''
      inputEl.style.height = 'auto'
      setStatus('Thinking...')
      showTyping()
      try {
        const result = await window.lily.chat(history)
        removeTyping()
        if (result.ok) {
          addMessage('lily', result.reply)
          history.push({ role: 'assistant', content: result.reply })
          if (history.length > 40) history = history.slice(-40)
          setStatus('Ready')
        } else {
          addMessage('system', 'Error: ' + result.error)
          setStatus('Error')
        }
      } catch (err) {
        removeTyping()
        addMessage('system', 'Something went wrong: ' + err.message)
        setStatus('Error')
      }
    }

    sendBtn.addEventListener('click', sendMessage)
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
    })
    inputEl.addEventListener('input', () => {
      inputEl.style.height = 'auto'
      inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px'
    })

    function openSettings() {
      document.getElementById('s-assistantName').value = config.assistantName || ''
      document.getElementById('s-userName').value = config.userName || ''
      document.getElementById('s-tone').value = config.tone || ''
      document.getElementById('s-aboutUser').value = config.aboutUser || ''
      document.getElementById('s-careNotes').value = config.careNotes || ''
      document.getElementById('s-memory').value = (config.memory || []).join('\n')
      document.getElementById('s-apiKey').value = config.apiKey || ''
      const sel = document.getElementById('s-model')
      if (sel) sel.value = config.model || 'llama-3.3-70b-versatile'
      settingsPanel.classList.remove('hidden')
    }

    async function saveSettings() {
      const c = {
        assistantName: document.getElementById('s-assistantName').value.trim() || 'Lily',
        userName: document.getElementById('s-userName').value.trim(),
        tone: document.getElementById('s-tone').value.trim(),
        aboutUser: document.getElementById('s-aboutUser').value.trim(),
        careNotes: document.getElementById('s-careNotes').value.trim(),
        memory: document.getElementById('s-memory').value.split('\n').map(s => s.trim()).filter(Boolean),
        apiKey: document.getElementById('s-apiKey').value.trim(),
        model: document.getElementById('s-model').value
      }
      try { config = await window.lily.saveSettings(c); addMessage('system', 'Settings saved.') }
      catch (e) { addMessage('system', 'Could not save.') }
      settingsPanel.classList.add('hidden')
    }

    settingsBtn.addEventListener('click', openSettings)
    saveSettingsBtn.addEventListener('click', saveSettings)
    closeSettingsBtn.addEventListener('click', () => settingsPanel.classList.add('hidden'))

    const name = config.assistantName || 'Lily'
    const user = config.userName ? ', ' + config.userName : ''
    addMessage('lily', 'Hi' + user + ". I'm " + name + ". I'm here whenever you need me.")
    setStatus('Ready')
  })()

  input.addEventListener('input', () => {
    input.style.height = 'auto'
    input.style.height = Math.min(input.scrollHeight, 120) + 'px'
  })

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  })

  sendBtn.addEventListener('click', sendMessage)

  $('btn-minimize').addEventListener('click', () => window.electron && window.electron.minimize && window.electron.minimize())
  $('btn-close').addEventListener('click', () => window.electron && window.electron.close && window.electron.close())

  function populateSettings() {
    $('s-assistantName').value = cfg.assistantName || ''
    $('s-userName').value = cfg.userName || ''
    $('s-tone').value = cfg.tone || ''
    $('s-aboutUser').value = cfg.aboutUser || ''
    $('s-careNotes').value = cfg.careNotes || ''
    $('s-memory').value = Array.isArray(cfg.memory) ? cfg.memory.join('\n') : ''
    $('s-apiKey').value = cfg.apiKey || ''
    const m = $('s-model')
    if (m) m.value = cfg.model || 'llama-3.3-70b-versatile'
  }

  settingsBtn.addEventListener('click', () => {
    populateSettings()
    settingsPanel.classList.remove('hidden')
  })

  $('close-settings-btn').addEventListener('click', () => settingsPanel.classList.add('hidden'))

  $('save-settings-btn').addEventListener('click', async () => {
    const newCfg = {
      assistantName: $('s-assistantName').value.trim() || 'Lily',
      userName: $('s-userName').value.trim(),
      tone: $('s-tone').value.trim(),
      aboutUser: $('s-aboutUser').value.trim(),
      careNotes: $('s-careNotes').value.trim(),
      memory: $('s-memory').value.split('\n').map(l => l.trim()).filter(Boolean),
      apiKey: $('s-apiKey').value.trim(),
      model: $('s-model').value
    }
    try {
      cfg = await window.lily.saveSettings(newCfg)
      settingsPanel.classList.add('hidden')
      setStatus('Settings saved')
      setTimeout(() => setStatus('Ready'), 2000)
    } catch (e) {
      addMsg('system', 'Could not save settings.')
    }
  })

  try {
    cfg = await window.lily.loadSettings()
  } catch (e) { cfg = {} }
  const name = cfg.assistantName || 'Lily'
  const user = cfg.userName ? ', ' + cfg.userName : ''
  addMsg('lily', 'Hi' + user + '. I am ' + name + '. I am here whenever you are ready.')
  setStatus(cfg.apiKey ? 'Connected' : 'Offline mode')
})()
