# Managed ChatKit Widget - Popup Chat Widget

A beautiful, lightweight chatbot widget powered by OpenAI's ChatKit API. Features a popup interface with a calm light blue design, perfect for embedding in websites.

## ✨ Features

- 🎨 **Light Blue Design**: Calm, professional aesthetic with rounded corners
- 📱 **Responsive**: Works on desktop and mobile
- ⚡ **Fast**: Built with React + Vite for optimal performance
- 🔒 **Secure**: API keys stored as environment variables
- 🚀 **Easy Deploy**: One-command deployment to Vercel

## 🎯 Widget Preview

- **Position**: Bottom-right corner (like Intercom/Drift)
- **Size**: 380×600px (desktop), full-width (mobile)
- **Style**: Light mode, soft blue (#4A90E2), rounded (16px)
- **Animations**: Smooth slide-up and fade transitions

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.18
- npm >= 9
- OpenAI API Key with ChatKit access
- ChatKit Workflow ID from OpenAI Agent Builder

### Local Development

1. **Clone and Navigate**
   ```bash
   cd managed-chatkit
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` File**
   ```bash
   cp .env.example .env
   ```

4. **Add Your Credentials**
   Edit `.env` and add:
   ```
   OPENAI_API_KEY=sk-proj-your-key-here
   VITE_CHATKIT_WORKFLOW_ID=wf_your-workflow-id
   ```

5. **Run Development Server**
   ```bash
   npm run frontend
   ```

6. **Open in Browser**
   Navigate to `http://localhost:5173`

---

## 📦 Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

(Opens browser for authentication)

### Step 3: Deploy Preview

```bash
vercel
```

**Follow the prompts:**
- Set up and deploy? → **Yes**
- Which scope? → **Your account**
- Link to existing project? → **No**
- Project name? → `my-chatbot-widget` (or your choice)
- In which directory is your code? → `./`
- Want to override settings? → **No**

**Result**: Preview URL like `https://my-chatbot-xyz.vercel.app`

### Step 4: Add Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:

   | Key | Value | Environment |
   |-----|-------|-------------|
   | `OPENAI_API_KEY` | `sk-proj-...` | Production, Preview, Development |
   | `VITE_CHATKIT_WORKFLOW_ID` | `wf_...` | Production, Preview, Development |

5. Click **Save**

### Step 5: Deploy to Production

```bash
vercel --prod
```

**Result**: Production URL like `https://my-chatbot.vercel.app`

### Step 6: Test Live

1. Visit your production URL
2. Click the blue chat button (bottom-right)
3. Send a test message
4. Verify response from your OpenAI workflow

---

## 🎨 Customization

### Change Colors

Edit `frontend/src/index.css`:

```css
:root {
  --widget-primary-blue: #4A90E2;  /* Your primary color */
  --widget-light-blue: #E3F2FD;    /* Message bubbles */
  --widget-text: #333333;           /* Text color */
}
```

### Change Widget Title

Edit `frontend/src/components/ChatKitPanel.tsx`:

```tsx
<h3 className="chat-title">Your Title Here</h3>
```

### Change Widget Size

Edit `frontend/src/index.css`:

```css
.widget-container {
  width: 380px;  /* Change width */
  height: 600px; /* Change height */
}
```

---

## 🔗 Integration with Main Website

Once deployed and tested, integrate into your main website using one of these methods:

### Option A: Script Tag (Recommended)

Add to your website's HTML:

```html
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://your-chatbot.vercel.app';
    iframe.style.cssText = 'position:fixed;bottom:0;right:0;width:100%;height:100%;border:none;z-index:9999;pointer-events:none;';
    iframe.setAttribute('id', 'chatbot-widget');
    document.body.appendChild(iframe);
  })();
</script>
```

### Option B: Iframe Embed

```html
<iframe 
  src="https://your-chatbot.vercel.app" 
  style="position:fixed; bottom:0; right:0; width:100vw; height:100vh; border:none; z-index:9999; pointer-events:none;">
</iframe>
```

### Option C: Copy Code

Copy the compiled code from `frontend/dist/` to your main website and point API calls to your Vercel backend at `https://your-chatbot.vercel.app/api/create-session`.

---

## 🛠️ Project Structure

```
managed-chatkit/
├── api/
│   └── create-session.js       # Vercel serverless function
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatKitPanel.tsx      # Main chat interface
│   │   │   └── WidgetButton.tsx      # Toggle button
│   │   ├── lib/
│   │   │   └── chatkitSession.ts     # Session management
│   │   ├── App.tsx                    # Root component
│   │   └── index.css                  # Styles & animations
│   └── package.json
├── vercel.json                   # Vercel configuration
├── .env.example                  # Environment template
└── package.json                  # Root dependencies
```

---

## 🔧 Environment Variables

### Required

- **`OPENAI_API_KEY`**: Your OpenAI API key (format: `sk-proj-...`)
  - Get from: [OpenAI Platform](https://platform.openai.com/api-keys)
  
- **`VITE_CHATKIT_WORKFLOW_ID`**: Your workflow ID (format: `wf_...`)
  - Get from: OpenAI Agent Builder

### Optional

- **`CHATKIT_API_BASE`**: Custom API endpoint (default: `https://api.openai.com`)
- **`NODE_ENV`**: Environment (auto-set by Vercel)

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build for production |
| `npm run frontend` | Run frontend dev server |
| `npm run frontend:build` | Build frontend only |
| `npm run frontend:lint` | Lint frontend code |

---

## 🐛 Troubleshooting

### Widget doesn't appear
- Check browser console for errors
- Verify environment variables are set in Vercel
- Ensure you've redeployed after adding env vars

### "Missing OPENAI_API_KEY" error
- Add `OPENAI_API_KEY` in Vercel dashboard
- Redeploy with `vercel --prod`

### "Failed to create session" error
- Verify your workflow ID is correct (starts with `wf_`)
- Ensure API key has ChatKit access
- Check API key and workflow are from same organization

### Chat messages not sending
- Open browser console and check Network tab
- Verify `/api/create-session` endpoint is responding
- Check CORS headers in Vercel logs

---

## 📚 Additional Resources

- [OpenAI ChatKit Documentation](https://platform.openai.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev)

---

## 🤝 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Vercel deployment logs
3. Check browser console for errors
4. Verify environment variables are correct

---

## 📄 License

This project is based on OpenAI's ChatKit starter templates.
