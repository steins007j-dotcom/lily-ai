(async () => {
    const $ = id => document.getElementById(id)
    const msgs = $('messages')
    const input = $('user-input')
    const sendBtn = $('send-btn')
    const statusText = $('status-text')
    const settingsPanel = $('settings-panel')
    const settingsBtn = $('settings-btn')
    const speakBtn = $('speak-btn')
    const waveBars = $('wave-bars')

   let history = []
       let cfg = {}
           let busy = false
    let lastLilyText = ''
    let speaking = false

   // ── TTS / Speech ──────────────────────────────────────
   function showWave() {
         waveBars.classList.add('active')
   }

   function hideWave() {
         waveBars.classList.remove('active')
   }

   function speak(text) {
         if (!window.speechSynthesis) {
                 alert('Sorry, your system does not support speech synthesis.')
                 return
         }
         // Stop any ongoing speech
      window.speechSynthesis.cancel()

      if (speaking) {
              speaking = false
              speakBtn.classList.remove('speaking')
              speakBtn.title = 'Speak last reply'
              hideWave()
              return
      }

      const utter = new SpeechSynthesisUtterance(text)
         utter.rate = 1.0
         utter.pitch = 1.1
         utter.volume = 1.0

      // Pick a good voice if available
      const voices = window.speechSynthesis.getVoices()
         const preferred = voices.find(v =>
                 v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
                                           ) || voices.find(v => v.lang.startsWith('en')) || voices[0]
         if (preferred) utter.voice = preferred

      utter.onstart = () => {
              speaking = true
              speakBtn.classList.add('speaking')
              speakBtn.title = 'Stop speaking'
              showWave()
      }

      utter.onend = () => {
              speaking = false
              speakBtn.classList.remove('speaking')
              speakBtn.title = 'Speak last reply'
              hideWave()
      }

      utter.onerror = () => {
              speaking = false
              speakBtn.classList.remove('speaking')
              speakBtn.title = 'Speak last reply'
              hideWave()
      }

      window.speechSynthesis.speak(utter)
   }

   speakBtn.addEventListener('click', () => {
         if (lastLilyText) {
                 speak(lastLilyText)
         } else {
                 statusText.textContent = 'Nothing to speak yet'
                 setTimeout(() => { statusText.textContent = 'Ready' }, 2000)
         }
   })

   // ── Messages ───────────────────────────────────────────
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
         const t = $('typing-indicator')
         if (t) t.remove()
   }

   // ── Settings ───────────────────────────────────────────
   async function loadCfg() {
         try {
                 cfg = await window.lily.getConfig()
         } catch {
                 cfg = {}
         }
   }

   function openSettings() {
         $('s-assistantName').value = cfg.assistantName || 'Lily'
         $('s-userName').value = cfg.userName || ''
         $('s-tone').value = cfg.tone || ''
         $('s-aboutUser').value = cfg.aboutUser || ''
         $('s-careNotes').value = cfg.careNotes || ''
         $('s-memory').value = (cfg.memory || []).join('\n')
         $('s-apiKey').value = cfg.apiKey || ''
         $('s-model').value = cfg.model || 'llama-3.3-70b-versatile'
         settingsPanel.classList.remove('hidden')
   }

   async function saveSettings() {
         cfg.assistantName = $('s-assistantName').value.trim() || 'Lily'
         cfg.userName = $('s-userName').value.trim()
         cfg.tone = $('s-tone').value.trim()
         cfg.aboutUser = $('s-aboutUser').value.trim()
         cfg.careNotes = $('s-careNotes').value.trim()
         cfg.memory = $('s-memory').value.split('\n').map(l => l.trim()).filter(Boolean)
         cfg.apiKey = $('s-apiKey').value.trim()
         cfg.model = $('s-model').value
         try {
                 await window.lily.saveConfig(cfg)
         } catch {}
         settingsPanel.classList.add('hidden')
         statusText.textContent = 'Settings saved'
         setTimeout(() => { statusText.textContent = 'Ready' }, 2000)
   }

   settingsBtn.addEventListener('click', openSettings)
    $('save-settings-btn').addEventListener('click', saveSettings)
    $('close-settings-btn').addEventListener('click', () => settingsPanel.classList.add('hidden'))

   // ── Send message ───────────────────────────────────────
   async function sendMessage() {
         const text = input.value.trim()
         if (!text || busy) return
         busy = true
         sendBtn.disabled = true
         input.value = ''
         input.style.height = 'auto'

      addMsg('user', text)
         history.push({ role: 'user', content: text })
         statusText.textContent = 'Thinking...'
         showTyping()

      try {
              const reply = await window.lily.chat({
                        history,
                        config: cfg
              })
              hideTyping()
              addMsg('lily', reply)
              lastLilyText = reply
              history.push({ role: 'assistant', content: reply })
              statusText.textContent = 'Ready'

           // Auto-speak reply if speech synthesis is available
           if (window.speechSynthesis) {
                     // Small delay to ensure voices are loaded
                setTimeout(() => speak(reply), 300)
           }
      } catch (err) {
              hideTyping()
              const errMsg = 'Error: ' + (err.message || 'Unknown error')
              addMsg('lily', errMsg)
              lastLilyText = errMsg
              statusText.textContent = 'Error'
              setTimeout(() => { statusText.textContent = 'Ready' }, 3000)
      }

      busy = false
         sendBtn.disabled = false
         input.focus()
   }

   sendBtn.addEventListener('click', sendMessage)

   input.addEventListener('keydown', e => {
         if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault()
                 sendMessage()
         }
   })

   input.addEventListener('input', () => {
         input.style.height = 'auto'
         input.style.height = Math.min(input.scrollHeight, 120) + 'px'
   })

   // ── Window controls ────────────────────────────────────
   $('btn-minimize').addEventListener('click', () => {
         try { window.lily.minimize() } catch {}
   })

   $('btn-close').addEventListener('click', () => {
         try { window.lily.close() } catch {}
   })

   // ── Init ───────────────────────────────────────────────
   await loadCfg()

   // Preload voices
   if (window.speechSynthesis) {
         window.speechSynthesis.getVoices()
         window.speechSynthesis.addEventListener('voiceschanged', () => {
                 window.speechSynthesis.getVoices()
         })
   }

   const name = cfg.assistantName || 'Lily'
    const greeting = `Hello! I'm ${name}. How can I help you today?`
    addMsg('lily', greeting)
    lastLilyText = greeting

   statusText.textContent = 'Ready'
    input.focus()
})()
