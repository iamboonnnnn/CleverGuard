# CleverGuard - Advanced Phishing Protection Browser Extension

🛡️ **CleverGuard** is a powerful browser extension that protects users from phishing attacks by detecting suspicious links and displaying warning overlays before users can access potentially dangerous websites. Compatible with **Chrome and all Chromium-based browsers** including Edge, Brave, Opera, and Vivaldi.

> **🚧 Demo Project:** This is a **hackathon demonstration** showcasing phishing protection concepts. Current detection capabilities are limited to a basic dataset. Future versions will include expanded databases and AI-powered detection.

## 🚀 Features

### Core Protection
- **Real-time Link Analysis**: Scans all clicked links for potential phishing threats
- **Multi-layered Detection**: Uses pattern matching, domain reputation, and blacklist checking
- **Instant Warning Display**: Shows full-screen red warning overlay for dangerous links
- **Email Platform Integration**: Special focus on protecting users within email environments

### Advanced Security
- **Known Phishing Domain Detection**: Maintains an updated blacklist of malicious domains
- **URL Pattern Analysis**: Identifies suspicious URL patterns commonly used by attackers
- **URL Shortener Detection**: Flags potentially dangerous shortened URLs
- **Safe Browsing Integration**: Simulates checks against security databases

### User Experience
- **Customizable Settings**: Enable/disable protection, strict mode, and user override options
- **User Feedback System**: Report false positives to improve accuracy
- **Statistics Tracking**: Monitor threats blocked and links checked
- **Accessibility Support**: Full keyboard navigation and screen reader compatibility

### Browser Compatibility
- **Google Chrome**: Full support with all features
- **Microsoft Edge**: Complete compatibility with Chromium engine
- **Brave Browser**: Works seamlessly with privacy features
- **Opera**: Full functionality including Opera GX
- **Vivaldi**: Compatible with all customization features
- **Other Chromium Browsers**: Any browser based on Chromium engine

## 🔧 Installation & Quick Setup (2 minutes)

### 📥 Download & Install

1. **Download Files**
   ```bash
   git clone https://github.com/yourusername/cleverguard-extension.git
   cd cleverguard-extension
   ```
   *Or download as ZIP and extract to a folder*

2. **Open Browser Extensions**
   - **Chrome:** Navigate to `chrome://extensions/`
   - **Edge:** Navigate to `edge://extensions/`
   - **Brave:** Navigate to `brave://extensions/`
   - **Opera:** Navigate to `opera://extensions/`
   - **Vivaldi:** Navigate to `vivaldi://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)

3. **Install Extension**
   - Click **"Load unpacked"**
   - Select the folder containing `manifest.json`
   - The extension should appear in your extensions list

4. **Verify Installation**
   - Look for the CleverGuard shield icon 🛡️ in your browser toolbar
   - Click the icon to open settings
   - Ensure "Protection Active" is displayed

### ✅ Test Your Protection

**Option 1: Extension Test (Recommended)**
1. Click the CleverGuard icon in your toolbar
2. Click "Test Protection" button
3. The hosted test page will open: [https://cleverguardtestpage.pages.dev/](https://cleverguardtestpage.pages.dev/)
4. Click on the "High Risk" test links to see red warning overlays

**Option 2: Real World Test**
1. Go to Gmail, iCloud Mail, Outlook, or any supported email client
2. Try clicking suspicious-looking links in your emails
3. The extension should intercept and warn you before accessing dangerous sites

> **📢 Important Note:** CleverGuard is currently a **demonstration project for hackathon purposes** and represents a fundamental extension with a **limited dataset**. Many real-world phishing links may not yet be detected. We are actively working to:
> - **Expand our threat database** with comprehensive phishing domain lists
> - **Integrate AI-powered detection models** for advanced pattern recognition
> - **Enhance real-time protection** through machine learning algorithms
> 
> This extension serves as a **proof of concept** showcasing phishing protection capabilities. For production use, we recommend using it alongside other security tools until our dataset and AI models are fully developed.

### 🚀 Future Release
*CleverGuard will be available on browser extension stores (Chrome Web Store, Edge Add-ons, etc.) soon for easier installation*

## ⚙️ Configuration

### Settings Panel
Click the CleverGuard icon in your browser toolbar to access:

- **Enable Protection**: Turn phishing detection on/off
- **Strict Mode**: Check ALL external links (not just suspicious ones)
- **Allow Proceed**: Let users continue to flagged sites with additional warnings

### Email Platform Integration
CleverGuard automatically activates enhanced protection on:
- Gmail (mail.google.com)
- Outlook (outlook.live.com, outlook.office.com)
- Yahoo Mail (mail.yahoo.com)
- AOL Mail (mail.aol.com)
- iCloud Mail (mail.icloud.com, www.icloud.com)
- ProtonMail (protonmail.com)
- Tutanota (tutanota.com)

## 🛡️ How It Works

### Link Detection Process
1. **Click Interception**: Captures all link clicks before navigation
2. **URL Analysis**: Analyzes the destination URL for threats
3. **Multi-factor Checking**:
   - Known phishing domain lookup
   - Suspicious pattern detection
   - URL shortener identification
   - External security service validation
4. **Decision & Action**: Either allows safe navigation or displays warning

### Warning Display
When a threat is detected:
- **Full-screen Red Overlay**: Covers entire page to prevent interaction
- **Clear Warning Message**: Large, bold text explaining the threat
- **Threat Level Indicator**: Shows HIGH/MEDIUM/LOW risk levels
- **Action Options**: 
  - "Go Back to Safety" (recommended)
  - "Proceed with Caution" (if enabled in settings)
  - "Report False Positive"

## 🎯 Usage Examples

### Testing the Extension
1. Click the CleverGuard icon in your toolbar
2. Click "Test Protection" button  
3. The hosted test page will open at [https://cleverguardtestpage.pages.dev/](https://cleverguardtestpage.pages.dev/)
4. Click test links to see warning overlays in action

### Real-world Protection
- **Email Links**: Click any link in Gmail, iCloud Mail, Outlook, etc.
- **Web Browsing**: Navigate normally - protection runs automatically
- **Social Media**: Click links from posts, messages, and ads

### Handling Warnings
When you see a warning:
1. **Read the threat details** carefully
2. **Choose "Go Back to Safety"** (recommended)
3. **Report false positives** if you believe the site is safe
4. **Only proceed with caution** if absolutely necessary

## 🔍 Threat Detection Categories

### High Risk Threats
- Known phishing domains from security blacklists
- Sites flagged by security services
- Domains with clear malicious intent

### Medium Risk Threats
- Suspicious URL patterns (fake bank domains, etc.)
- URL shorteners that could hide destinations
- Domains using suspicious TLDs (.tk, .ml, .ga, .cf)

### Low Risk Threats
- Malformed or unusual URLs
- Potential typosquatting domains
- Sites with mixed security indicators

## 📊 Statistics & Monitoring

The extension tracks:
- **Threats Blocked**: Total number of phishing attempts prevented
- **Links Checked**: Total number of URLs analyzed
- **False Positive Reports**: User feedback for improving accuracy

Access statistics through the popup interface by clicking the extension icon.

## 🛠️ Technical Details

### Architecture
- **Manifest V3**: Uses latest Chrome extension standard
- **Service Worker**: Background processing for URL analysis
- **Content Scripts**: Page-level link interception
- **Storage API**: Settings and statistics persistence

### Security Considerations
- **No Data Collection**: URLs are analyzed locally when possible
- **Privacy First**: No personal information is transmitted
- **Minimal Permissions**: Only requests necessary browser permissions
- **Secure Communication**: All external API calls use HTTPS

### Performance
- **Lightweight**: Minimal impact on browser performance
- **Efficient**: Smart caching reduces redundant checks
- **Non-blocking**: UI remains responsive during analysis

## 🔧 Development & Customization

### File Structure
```
cleverguard/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for URL analysis
├── content.js            # Content script for link interception
├── warning.css           # Styles for warning overlay
├── popup.html            # Settings interface HTML
├── popup.js              # Settings interface logic
├── icons/                # Extension icons
└── README.md             # This documentation
```

### Customizing Detection Rules
Edit `background.js` to modify:
- `KNOWN_PHISHING_DOMAINS`: Add/remove known malicious domains
- `SUSPICIOUS_PATTERNS`: Update regex patterns for threat detection
- `URL_SHORTENERS`: Modify list of flagged URL shortening services

### Styling the Warning
Modify `warning.css` to customize:
- Warning overlay appearance
- Color schemes for different threat levels
- Responsive design breakpoints

## 🐛 Troubleshooting

### Quick Fixes

**Extension not loading?**
- Make sure **Developer mode** is ON in your browser's extensions page
- Check that you selected the correct folder with `manifest.json`
- Refresh the extensions page and try again
- Ensure your Chromium-based browser is up to date

**No warnings appearing?**
- Verify protection is **enabled** in the popup settings
- Try the **"Test Protection"** button first
- Check browser console (F12) for error messages
- Test with known suspicious links from `test-page.html`

**False positives?**
- Use the **"Report False Positive"** button in warnings
- Adjust **Strict Mode** settings if too aggressive
- Check if the URL actually contains suspicious elements

**Performance issues?**
- Disable **Strict Mode** if checking too many links
- Clear browser cache and restart your browser
- Check for conflicts with other security extensions
- Monitor extension performance in Task Manager

### Debug Mode
Enable debug logging by opening Developer Tools (F12) and checking the Console tab for CleverGuard messages.

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Report Issues**: Use GitHub issues for bugs and feature requests
2. **Submit Pull Requests**: Fork the repo and submit improvements
3. **Test & Feedback**: Try the extension and report your experience
4. **Documentation**: Help improve these docs and add translations

### Development Setup
```bash
git clone https://github.com/yourusername/cleverguard-extension.git
cd cleverguard-extension
# Load in Chrome as described in installation section
# Make changes and reload extension to test
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Chrome Extension documentation and community
- Security researchers who identify phishing patterns
- Open source security tools and databases
- All users who provide feedback to improve detection

---

**Stay Safe Online! 🛡️**

*CleverGuard - Your first line of defense against phishing attacks.* 