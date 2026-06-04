# Lily — Personal AI Companion

A JARVIS-style desktop AI companion built with Electron and powered by the Groq API (or offline fallback responses).

## Features

- Frameless, transparent JARVIS-style dark UI with glowing cyan accent
- - Animated avatar with pulse and flicker effects
  - - Chat with conversation history sent to the AI
    - - Powered by Groq API (Llama 3.3 70B, Mixtral, Gemma and more)
      - - Offline fallback mode — works without an API key
        - - Persistent settings saved to `~/.lily/config.json`
          - - Customisable assistant name, tone, user info, care notes, and memory
            - - Auto-resizing input textarea, typing indicator, smooth message animations
              - - Minimal settings panel accessible via the gear icon
               
                - ## Requirements
               
                - - [Node.js](https://nodejs.org/) v18+
                  - - [npm](https://www.npmjs.com/)
                   
                    - ## Setup
                   
                    - ```bash
                      # Clone the repo
                      git clone https://github.com/steins007j-dotcom/lily-ai.git
                      cd lily-ai

                      # Install dependencies
                      npm install

                      # Start the app
                      npm start
                      ```

                      ## Configuration

                      On first launch, a config file is created at `~/.lily/config.json`.
                      You can edit settings directly in the app by clicking the gear icon.

                      | Setting | Description |
                      |---|---|
                      | `assistantName` | What the AI calls itself |
                      | `userName` | Your name (used in greetings) |
                      | `tone` | Personality/tone description |
                      | `aboutUser` | Context about you for the AI |
                      | `careNotes` | How the AI should care for you |
                      | `memory` | Array of persistent memory items |
                      | `apiKey` | Your [Groq API key](https://console.groq.com/) |
                      | `model` | Groq model to use |

                      ## Getting a Groq API Key

                      1. Go to [https://console.groq.com/](https://console.groq.com/)
                      2. 2. Sign up for a free account
                         3. 3. Create an API key
                            4. 4. Paste it into Lily's settings panel
                              
                               5. ## Project Structure
                              
                               6. ```
                                  lily-ai/
                                    main.js         # Electron main process — window, IPC, Groq API calls
                                    preload.js      # Context bridge exposing lily API to renderer
                                    renderer.js     # Frontend logic — chat, settings, UI interactions
                                    index.html      # App HTML shell
                                    styles.css      # JARVIS-style dark UI with animations
                                    package.json    # Project metadata and dependencies
                                  ```

                                  ## License

                                  GPL-2.0# Lily — Personal AI Companion

                                  > A JARVIS-style desktop AI companion built with Electron + Groq
                                  >
                                  > Lily is a frameless, always-ready desktop app that gives you a warm, emotionally-aware AI companion in a sleek dark UI. She works offline with smart fallback replies, or connects to the Groq API for full LLM-powered conversation.
                                  >
                                  > ---
                                  >
                                  > ## Features
                                  >
                                  > - **JARVIS-style dark UI** — glowing cyan/purple aesthetic with animated avatar
                                  > - - **Groq API integration** — uses `llama-3.3-70b-versatile` by default (fast & free)
                                  >   - - **Offline fallback** — smart replies even without an API key
                                  >     - - **Persistent config** — settings saved locally to `~/.lily/config.json`
                                  >       - - **Customizable** — name, tone, memory, care notes, user profile
                                  >         - - **Frameless window** — minimal, floats on your desktop
                                  >           - - **Typing indicator** — animated dots while Lily is thinking
                                  >            
                                  >             - ---
                                  >
                                  > ## Quick Start
                                  >
                                  > ### Prerequisites
                                  > - [Node.js](https://nodejs.org/) (v18+)
                                  > - - A free [Groq API key](https://console.groq.com/) (optional but recommended)
                                  >  
                                  >   - ### Install & Run
                                  >  
                                  >   - ```bash
                                  >     git clone https://github.com/steins007j-dotcom/lily-ai.git
                                  >     cd lily-ai
                                  >     npm install
                                  >     npm start
                                  >     ```
                                  >
                                  > ### First Launch
                                  >
                                  > 1. Click the **gear icon** (⚙) at the bottom right
                                  > 2. 2. Enter your **Groq API key** (get one free at [console.groq.com](https://console.groq.com/))
                                  >    3. 3. Set your name and customize Lily's tone/memory
                                  >       4. 4. Click **Save** — Lily is ready!
                                  >         
                                  >          5. > Without an API key, Lily runs in offline mode with pre-written emotional responses.
                                  >             >
                                  >             > ---
                                  >             >
                                  >             > ## Project Structure
                                  >             >
                                  >             > ```
                                  >             > lily-ai/
                                  >             > ├── main.js          # Electron main process — window, IPC, config, Groq API
                                  >             > ├── preload.js       # Context bridge — exposes lily.* API to renderer
                                  >             > ├── renderer.js      # Frontend logic — chat, settings, UI interactions
                                  >             > ├── index.html       # App layout — titlebar, avatar, chat, input, settings panel
                                  >             > ├── styles.css       # JARVIS dark theme — CSS variables, animations, glows
                                  >             > └── package.json     # Electron app config
                                  >             > ```
                                  >             >
                                  >             > ---
                                  >             >
                                  >             > ## Configuration
                                  >             >
                                  >             > Settings are stored at `~/.lily/config.json`. You can edit via the in-app settings panel or directly:
                                  >             >
                                  >             > | Field | Description |
                                  >             > |-------|-------------|
                                  >             > | `assistantName` | What Lily calls herself |
                                  >             > | `userName` | Your name (used in replies) |
                                  >             > | `tone` | Personality description for the system prompt |
                                  >             > | `aboutUser` | Context about you passed to the AI |
                                  >             > | `careNotes` | How Lily should care for you |
                                  >             > | `memory` | Array of persistent memory items |
                                  >             > | `apiKey` | Your Groq API key |
                                  >             > | `model` | Groq model ID (default: `llama-3.3-70b-versatile`) |
                                  >             >
                                  >             > ---
                                  >             >
                                  >             > ## Models
                                  >             >
                                  >             > | Model | Speed | Notes |
                                  >             > |-------|-------|-------|
                                  >             > | `llama-3.3-70b-versatile` | Fast | Default, best quality |
                                  >             > | `llama-3.1-8b-instant` | Very fast | Lightweight |
                                  >             > | `mixtral-8x7b-32768` | Fast | Long context |
                                  >             > | `gemma2-9b-it` | Fast | Google model |
                                  >             >
                                  >             > ---
                                  >             >
                                  >             > ## License
                                  >             >
                                  >             > GPL-2.0 — see [LICENSE](LICENSE)
