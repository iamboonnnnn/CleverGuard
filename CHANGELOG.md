# CleverGuard Extension - Changelog

All notable changes to the CleverGuard Chrome extension will be documented in this file.

## [1.1.0] - 2025-01-06

### 🆕 Added
- **Enhanced Phishing Domain Database**: Added 5 new known phishing domains to the blacklist
  - `secure-banking.tk`
  - `paypal-verify.ml` 
  - `amazon-security.ga`
  - `microsoft-login.cf`
  - `apple-support.tk`
- **Improved Console Logging**: Better version tracking in console messages
- **Statistics Enhancement**: Added tracking for last threat blocked timestamp

### 🔄 Changed
- **Version Update**: Bumped extension version to 1.1
- **Detection Coverage**: Expanded protection against fake banking and tech support sites

### 🛠️ Technical
- Updated manifest.json version number
- Enhanced background service worker with additional threat patterns
- Improved popup interface version display

### 🔒 Security
- **Better Protection**: Now detects more sophisticated phishing attempts targeting major brands
- **Pattern Recognition**: Enhanced detection of fake security pages

---

## [1.0.0] - 2025-01-05

### 🎉 Initial Release
- **Core Phishing Detection**: Real-time link analysis and threat detection
- **Warning Overlay System**: Full-screen red warning for dangerous sites
- **Multi-platform Support**: Enhanced protection for email platforms (Gmail, Outlook, etc.)
- **User Controls**: Customizable settings with strict mode and user override options
- **Statistics Tracking**: Monitor threats blocked and links checked
- **Test Functionality**: Built-in testing system for verification

### 📁 Core Files
- `manifest.json` - Extension configuration (Manifest V3)
- `background.js` - Service worker for URL analysis
- `content.js` - Content script for link interception
- `warning.css` - Warning overlay styles
- `popup.html` & `popup.js` - Settings interface
- `README.md` - Complete documentation
- `LICENSE` - MIT License
- `test-page.html` - Testing framework

### 🛡️ Security Features
- Known phishing domain blacklist
- Suspicious URL pattern detection
- URL shortener flagging
- Safe browsing integration
- User feedback system

---

## 🔮 Coming Soon

### [1.2.0] - Planned Features
- **Real Safe Browsing API**: Integration with Google Safe Browsing API
- **Machine Learning**: AI-powered phishing detection
- **Cloud Sync**: Settings synchronization across devices
- **Advanced Reporting**: Detailed threat analysis reports
- **Custom Rules**: User-defined detection patterns

### [2.0.0] - Major Update
- **Enterprise Features**: Admin controls and centralized management
- **Browser Extension**: Support for Firefox and Edge
- **Mobile Protection**: Companion mobile app
- **API Integration**: Third-party security service integration

---

**🛡️ Stay Protected with CleverGuard!**

*For support and feature requests, visit: https://github.com/iamboonnnnn/CleverGuard* 