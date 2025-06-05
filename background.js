// CleverGuard Background Service Worker
// Handles phishing URL detection and analysis

// Known phishing domains (example list - would be updated regularly)
const KNOWN_PHISHING_DOMAINS = [
  'phishing-example.com',
  'fake-bank.net',
  'suspicious-site.org',
  'malware-domain.com',
  'scam-website.info'
];

// Suspicious patterns in URLs
const SUSPICIOUS_PATTERNS = [
  /secure.*\.tk$/,
  /bank.*\.ml$/,
  /paypal.*\.ga$/,
  /amazon.*\.cf$/,
  /microsoft.*\.tk$/,
  /apple.*\.ml$/,
  /google.*\.ga$/,
  /facebook.*\.cf$/,
  /\.bit$/,
  /\.onion$/
];

// URL shortener domains that could hide phishing links
const URL_SHORTENERS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly'
];

class PhishingDetector {
  constructor() {
    this.settings = {
      enabled: true,
      strictMode: false,
      allowUserProceed: true
    };
    this.loadSettings();
  }

  async loadSettings() {
    const result = await chrome.storage.sync.get(['cleverguardSettings']);
    if (result.cleverguardSettings) {
      this.settings = { ...this.settings, ...result.cleverguardSettings };
    }
  }

  async saveSettings() {
    await chrome.storage.sync.set({ cleverguardSettings: this.settings });
  }

  // Extract domain from URL
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.toLowerCase();
    } catch (e) {
      return null;
    }
  }

  // Check if URL is suspicious based on patterns
  isSuspiciousPattern(url) {
    return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(url));
  }

  // Check if domain is a known phishing domain
  isKnownPhishingDomain(domain) {
    return KNOWN_PHISHING_DOMAINS.includes(domain);
  }

  // Check if URL uses a URL shortener
  isUrlShortener(domain) {
    return URL_SHORTENERS.includes(domain);
  }

  // Check domain reputation using Google Safe Browsing (simplified)
  async checkSafeBrowsing(url) {
    // In a real implementation, you would use Google Safe Browsing API
    // For demo purposes, we'll simulate the check
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return true if URL appears in our simulated threat list
      const domain = this.extractDomain(url);
      if (domain && (
        domain.includes('phishing') ||
        domain.includes('malware') ||
        domain.includes('scam') ||
        domain.includes('fake')
      )) {
        return { threat: true, type: 'MALWARE' };
      }
      
      return { threat: false };
    } catch (error) {
      console.error('Safe Browsing check failed:', error);
      return { threat: false, error: true };
    }
  }

  // Main URL analysis function
  async analyzeUrl(url) {
    if (!this.settings.enabled) {
      return { safe: true, reason: 'Detection disabled' };
    }

    const domain = this.extractDomain(url);
    if (!domain) {
      return { safe: false, reason: 'Invalid URL format', threat: 'LOW' };
    }

    // Check known phishing domains
    if (this.isKnownPhishingDomain(domain)) {
      return {
        safe: false,
        reason: 'Known phishing domain',
        threat: 'HIGH',
        details: 'This domain is on our blacklist of known phishing sites.'
      };
    }

    // Check suspicious patterns
    if (this.isSuspiciousPattern(url)) {
      return {
        safe: false,
        reason: 'Suspicious URL pattern',
        threat: 'MEDIUM',
        details: 'This URL matches patterns commonly used by phishing sites.'
      };
    }

    // Check URL shorteners
    if (this.isUrlShortener(domain)) {
      return {
        safe: false,
        reason: 'URL shortener detected',
        threat: 'MEDIUM',
        details: 'Shortened URLs can hide the true destination and may be used for phishing.'
      };
    }

    // Check with Safe Browsing API
    const safeBrowsingResult = await this.checkSafeBrowsing(url);
    if (safeBrowsingResult.threat) {
      return {
        safe: false,
        reason: 'Flagged by security services',
        threat: 'HIGH',
        details: `This site has been flagged as potentially dangerous (${safeBrowsingResult.type}).`
      };
    }

    return { safe: true, reason: 'URL appears safe' };
  }
}

const phishingDetector = new PhishingDetector();

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'checkUrl') {
    phishingDetector.analyzeUrl(request.url)
      .then(result => sendResponse(result))
      .catch(error => {
        console.error('URL analysis failed:', error);
        sendResponse({ safe: true, error: 'Analysis failed' });
      });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'getSettings') {
    sendResponse(phishingDetector.settings);
  }
  
  if (request.action === 'updateSettings') {
    phishingDetector.settings = { ...phishingDetector.settings, ...request.settings };
    phishingDetector.saveSettings();
    sendResponse({ success: true });
  }
  
  if (request.action === 'reportFeedback') {
    // Handle user feedback about false positives/negatives
    console.log('User feedback:', request.feedback);
    // In a real implementation, this would be sent to a server
    sendResponse({ success: true });
  }
});

// Extension installation/update handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('CleverGuard installed successfully');
    // Set default settings
    phishingDetector.saveSettings();
  }
});

console.log('CleverGuard background service worker loaded'); 