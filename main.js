const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')
const os = require('os')

const CONFIG_DIR = path.join(os.homedir(), '.lily')
const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json')

const DEFAULT_CONFIG = {
  assistantName: 'Lily',
    userName: '',
      tone: 'gentle, feminine, warm, emotionally aware, and supportive',
        aboutUser: 'I want support that feels personal, calm, and caring. Keep replies clear and natural.',
          careNotes: 'Check in gently. Be encouraging without sounding fake. Offer one practical next step when useful.',
            memory: [
                'You are my personal assistant.',
                    'I want you to sound caring and emotionally aware.',
                        'Keep your replies natural and human.'
                          ],
                            apiKey: '',
                              model: 'llama-3.3-70b-versatile'
                              }

                              function ensureConfig() {
                                fs.mkdirSync(CONFIG_DIR, { recursive: true })
                                  if (!fs.existsSync(CONFIG_PATH)) {
                                      fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2))
                                          return { ...DEFAULT_CONFIG }
                                            }
                                              try {
                                                  const parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
                                                      return { ...DEFAULT_CONFIG, ...parsed, memory: Array.isArray(parsed.memory) ? parsed.memory : DEFAULT_CONFIG.memory }
                                                        } catch {
                                                            return { ...DEFAULT_CONFIG }
                                                              }
                                                              }

                                                              function saveConfig(config) {
                                                                const next = { ...DEFAULT_CONFIG, ...config, memory: Array.isArray(config.memory) ? config.memory : DEFAULT_CONFIG.memory }
                                                                  fs.mkdirSync(CONFIG_DIR, { recursive: true })
                                                                    fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2))
                                                                      return next
                                                                      }

                                                                      function buildSystemPrompt(config) {
                                                                        const memoryBlock = config.memory.filter(Boolean).map(item => `- ${item}`).join('\n')
                                                                          return [
                                                                              `You are ${config.assistantName}, a personal AI companion for ${config.userName || 'your user'}.`,
                                                                                  `Your tone is ${config.tone}.`,
                                                                                      'You should feel caring, feminine, emotionally present, calm, and direct.',
                                                                                          'Speak naturally. Do not say "as an AI".',
                                                                                              'Sound like a woman with a soft, personal, warm presence.',
                                                                                                  'Keep answers concise by default unless the user asks for depth.',
                                                                                                      `About the user: ${config.aboutUser}`,
                                                                                                          `Care instructions: ${config.careNotes}`,
                                                                                                              memoryBlock ? `Personal memory:\n${memoryBlock}` : ''
                                                                                                                ].filter(Boolean).join('\n\n')
                                                                                                                }
                                                                                                                
                                                                                                                async function callGroq(config, messages) {
                                                                                                                  if (!config.apiKey) return buildOfflineReply(config, messages)
                                                                                                                    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                                                                                                                        method: 'POST',
                                                                                                                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
                                                                                                                                body: JSON.stringify({ model: config.model, temperature: 0.8, max_tokens: 700, messages: [{ role: 'system', content: buildSystemPrompt(config) }, ...messages] })
                                                                                                                                  })
                                                                                                                                    const data = await response.json()
                                                                                                                                      if (!response.ok) throw new Error(data?.error?.message || 'Groq request failed.')
                                                                                                                                        return data?.choices?.[0]?.message?.content?.trim() || ''
                                                                                                                                        }
                                                                                                                                        
                                                                                                                                        function buildOfflineReply(config, messages) {
                                                                                                                                          const userMessages = messages.filter(m => m.role === 'user').map(m => m.content.trim()).filter(Boolean)
                                                                                                                                            const last = userMessages[userMessages.length - 1] || ''
                                                                                                                                              const name = config.userName || 'you'
                                                                                                                                                const lily = config.assistantName || 'Lily'
                                                                                                                                                  const low = last.toLowerCase()
                                                                                                                                                  
                                                                                                                                                    if (!last) return `${name}, I'm here with you. Tell me what's on your mind.`
                                                                                                                                                      if (/(sad|hurt|cry|lonely|anxious|overwhelmed|stress|panic|tired|empty|bad)/.test(low))
                                                                                                                                                          return `${name}, I'm here with you. It sounds really heavy right now. Stay with me — what's the hardest part?`
                                                                                                                                                            if (/(hello|hi|hey)\b/.test(low))
                                                                                                                                                                return `Hi, I'm ${lily}. I'm here and I'm listening. How are you feeling right now, honestly?`
                                                                                                                                                                  if (/(what can you do|help me|what do you do)/.test(low))
                                                                                                                                                                      return `I'm ${lily}, your personal companion. I'm here to listen, help you think things through, and support you however I can. What's on your mind?`
                                                                                                                                                                        if (/(thank|thanks|appreciate)/.test(low))
                                                                                                                                                                            return `Always. I'm here whenever you need me, ${name}.`
                                                                                                                                                                              if (/(bye|goodbye|see you|later)/.test(low))
                                                                                                                                                                                  return `Take care of yourself, ${name}. I'll be right here when you come back.`
                                                                                                                                                                                    return `I'm here, ${name}. Tell me more — I'm listening.`
                                                                                                                                                                                    }
                                                                                                                                                                                    
                                                                                                                                                                                    function createWindow() {
                                                                                                                                                                                      const win = new BrowserWindow({
                                                                                                                                                                                          width: 420,
                                                                                                                                                                                              height: 700,
                                                                                                                                                                                                  frame: false,
                                                                                                                                                                                                      transparent: true,
                                                                                                                                                                                                          resizable: true,
                                                                                                                                                                                                              alwaysOnTop: false,
                                                                                                                                                                                                                  webPreferences: {
                                                                                                                                                                                                                        preload: path.join(__dirname, 'preload.js'),
                                                                                                                                                                                                                              contextIsolation: true,
                                                                                                                                                                                                                                    nodeIntegration: false
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                          })
                                                                                                                                                                                                                                            win.loadFile('index.html')
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                            app.whenReady().then(() => {
                                                                                                                                                                                                                                              ipcMain.handle('lily:load-settings', () => ensureConfig())
                                                                                                                                                                                                                                                ipcMain.handle('lily:save-settings', (_event, newConfig) => saveConfig(newConfig))
                                                                                                                                                                                                                                                  ipcMain.handle('lily:chat', async (_event, { messages }) => {
                                                                                                                                                                                                                                                      const cfg = ensureConfig()
                                                                                                                                                                                                                                                          try {
                                                                                                                                                                                                                                                                return { ok: true, reply: await callGroq(cfg, messages) }
                                                                                                                                                                                                                                                                    } catch (err) {
                                                                                                                                                                                                                                                                          return { ok: false, error: err.message }
                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                })
                                                                                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                                  createWindow()
                                                                                                                                                                                                                                                                                  
                                                                                                                                                                                                                                                                                    app.on('activate', () => {
                                                                                                                                                                                                                                                                                        if (BrowserWindow.getAllWindows().length === 0) createWindow()
                                                                                                                                                                                                                                                                                          })
                                                                                                                                                                                                                                                                                          })
                                                                                                                                                                                                                                                                                          
                                                                                                                                                                                                                                                                                          app.on('window-all-closed', () => {
                                                                                                                                                                                                                                                                                            if (process.platform !== 'darwin') app.quit()
                                                                                                                                                                                                                                                                                            })
