# Lily — Personal AI Companion

A JARVIS-style desktop AI companion built with Electron and powered by the Groq API (or offline fallback responses).

## Features

- Frameless, transparent JARVIS-style dark UI with glowing cyan accent
- Animated avatar with pulse and flicker effects
- Chat with full conversation history sent to the AI
- Powered by Groq API (Llama 3.3 70B, Mixtral, Gemma and more)
- Offline fallback mode — works without an API key
- Persistent settings saved to `~/.lily/config.json`
- Customisable assistant name, tone, user info, care notes, and memory
- Auto-resizing input, typing indicator, smooth message animations
- Settings panel accessible via the gear icon

## Requirements

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)

## Setup

```bash
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
2. Sign up for a free account
3. Create an API key
4. Paste it into Lily's settings panel

## Project Structure

```
lily-ai/
  main.js         # Electron main process — window, IPC, Groq API calls
  preload.js      # Context bridge exposing lily API to renderer
  renderer.js     # Frontend logic — chat, settings, UI interactions
  index.html      # App HTML shell
  styles.css      # JARVIS-style dark UI with animations
  package.json    # Project metadata and dependencies
```

## License

GPL-2.0
