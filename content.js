// CleverGuard Content Script
// Intercepts link clicks and displays phishing warnings

class CleverGuardProtection {
  constructor() {
    this.isWarningActive = false;
    this.originalUrl = null;
    this.lastCheckedUrl = null;
    this.settings = null;
    this.init();
  }

  async init() {
    // Load settings from background
    this.settings = await this.getSettings();
    
    if (!this.settings.enabled) {
      return;
    }

    // Only activate on email platforms and suspicious contexts
    if (this.isEmailPlatform() || this.shouldMonitorLinks()) {
      this.setupLinkInterception();
      console.log('CleverGuard protection activated');
    }
  }

  // Check if current page is an email platform
  isEmailPlatform() {
    const hostname = window.location.hostname.toLowerCase();
    const emailPlatforms = [
      'mail.google.com',
      'outlook.live.com',
      'outlook.office.com',
      'mail.yahoo.com',
      'mail.aol.com',
      'protonmail.com',
      'tutanota.com'
    ];
    
    return emailPlatforms.some(platform => hostname.includes(platform));
  }

  // Check if we should monitor links on this page
  shouldMonitorLinks() {
    // Monitor all HTTPS pages for comprehensive protection
    return window.location.protocol === 'https:' || window.location.protocol === 'http:';
  }

  // Get settings from background script
  async getSettings() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
        resolve(response || { enabled: true, allowUserProceed: true });
      });
    });
  }

  // Setup link click interception
  setupLinkInterception() {
    // Intercept all link clicks
    document.addEventListener('click', this.handleLinkClick.bind(this), true);
    
    // Also handle programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      this.handleUrlChange(args[2]);
      originalPushState.apply(history, args);
    };
    
    history.replaceState = (...args) => {
      this.handleUrlChange(args[2]);
      originalReplaceState.apply(history, args);
    };
    
    window.addEventListener('popstate', (event) => {
      this.handleUrlChange(window.location.href);
    });
  }

  // Handle link clicks
  async handleLinkClick(event) {
    if (this.isWarningActive) {
      return; // Don't interfere with warning overlay
    }

    const link = event.target.closest('a');
    if (!link || !link.href) {
      return;
    }

    // Skip internal links and anchors
    if (link.href.startsWith('#') || link.href.startsWith('javascript:')) {
      return;
    }

    // Skip same-domain links unless in strict mode
    if (!this.settings.strictMode && this.isSameDomain(link.href)) {
      return;
    }

    // Prevent default navigation
    event.preventDefault();
    event.stopPropagation();

    // Show loading indicator
    this.showLoadingIndicator();

    try {
      // Check URL with background script
      const analysis = await this.checkUrlSafety(link.href);
      
      this.hideLoadingIndicator();

      if (!analysis.safe) {
        // Show phishing warning
        await this.showPhishingWarning(link.href, analysis);
      } else {
        // URL is safe, proceed with navigation
        this.navigateToUrl(link.href, link.target);
      }
    } catch (error) {
      console.error('CleverGuard URL check failed:', error);
      this.hideLoadingIndicator();
      // On error, allow navigation but log the issue
      this.navigateToUrl(link.href, link.target);
    }
  }

  // Handle URL changes (for single-page apps)
  async handleUrlChange(newUrl) {
    if (!newUrl || newUrl === this.lastCheckedUrl) {
      return;
    }

    this.lastCheckedUrl = newUrl;
    
    // Only check external URLs
    if (this.isSameDomain(newUrl)) {
      return;
    }

    try {
      const analysis = await this.checkUrlSafety(newUrl);
      if (!analysis.safe) {
        // Block the page load and show warning
        this.showPhishingWarning(newUrl, analysis);
      }
    } catch (error) {
      console.error('CleverGuard URL change check failed:', error);
    }
  }

  // Check if URL is same domain
  isSameDomain(url) {
    try {
      const currentDomain = window.location.hostname;
      const urlDomain = new URL(url).hostname;
      return currentDomain === urlDomain;
    } catch (e) {
      return false;
    }
  }

  // Check URL safety with background script
  async checkUrlSafety(url) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { action: 'checkUrl', url: url },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  // Show loading indicator
  showLoadingIndicator() {
    if (document.getElementById('cleverguard-loading')) {
      return;
    }

    const loading = document.createElement('div');
    loading.id = 'cleverguard-loading';
    loading.innerHTML = `
      <div class="cleverguard-loading-overlay">
        <div class="cleverguard-loading-content">
          <div class="cleverguard-spinner"></div>
          <p>Checking link safety...</p>
        </div>
      </div>
    `;
    document.body.appendChild(loading);
  }

  // Hide loading indicator
  hideLoadingIndicator() {
    const loading = document.getElementById('cleverguard-loading');
    if (loading) {
      loading.remove();
    }
  }

  // Show phishing warning overlay
  async showPhishingWarning(url, analysis) {
    if (this.isWarningActive) {
      return;
    }

    this.isWarningActive = true;
    this.originalUrl = window.location.href;

    // Create warning overlay
    const warningOverlay = document.createElement('div');
    warningOverlay.id = 'cleverguard-phishing-warning';
    warningOverlay.className = 'cleverguard-warning-overlay';
    
    const threatLevel = analysis.threat || 'MEDIUM';
    const warningColor = this.getThreatColor(threatLevel);
    
    warningOverlay.innerHTML = `
      <div class="cleverguard-warning-content">
        <div class="cleverguard-warning-header">
          <div class="cleverguard-warning-icon">⚠️</div>
          <h1 class="cleverguard-warning-title">WARNING: PHISHING ATTEMPT DETECTED!</h1>
        </div>
        
        <div class="cleverguard-warning-body">
          <div class="cleverguard-threat-level ${threatLevel.toLowerCase()}">
            Threat Level: <strong>${threatLevel}</strong>
          </div>
          
          <div class="cleverguard-warning-details">
            <p><strong>Reason:</strong> ${analysis.reason}</p>
            ${analysis.details ? `<p><strong>Details:</strong> ${analysis.details}</p>` : ''}
            <p><strong>Blocked URL:</strong> <code>${this.sanitizeUrl(url)}</code></p>
          </div>
          
          <div class="cleverguard-warning-advice">
            <h3>🛡️ What should you do?</h3>
            <ul>
              <li>Do not enter any personal information on this site</li>
              <li>Do not download any files from this site</li>
              <li>Report this link to your IT administrator</li>
              <li>Consider running a security scan on your device</li>
            </ul>
          </div>
        </div>
        
        <div class="cleverguard-warning-actions">
          <button id="cleverguard-exit-btn" class="cleverguard-btn cleverguard-btn-safe">
            🔙 Go Back to Safety
          </button>
          
          ${this.settings.allowUserProceed ? `
            <button id="cleverguard-proceed-btn" class="cleverguard-btn cleverguard-btn-danger">
              ⚠️ Proceed with Extreme Caution
            </button>
          ` : ''}
          
          <button id="cleverguard-report-btn" class="cleverguard-btn cleverguard-btn-secondary">
            📝 Report False Positive
          </button>
        </div>
        
        <div class="cleverguard-warning-footer">
          <p>Protected by CleverGuard Security Extension</p>
          <small>This warning helps protect you from phishing attacks and malicious websites.</small>
        </div>
      </div>
    `;

    // Apply threat-level specific styling
    warningOverlay.style.backgroundColor = warningColor;
    
    document.body.appendChild(warningOverlay);

    // Setup event handlers
    this.setupWarningEventHandlers(url, warningOverlay);

    // Prevent page interaction
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const exitBtn = document.getElementById('cleverguard-exit-btn');
    if (exitBtn) {
      exitBtn.focus();
    }
  }

  // Get color based on threat level
  getThreatColor(level) {
    switch (level.toUpperCase()) {
      case 'HIGH':
        return 'rgba(220, 20, 20, 0.95)';
      case 'MEDIUM':
        return 'rgba(255, 140, 0, 0.95)';
      case 'LOW':
        return 'rgba(255, 193, 7, 0.95)';
      default:
        return 'rgba(220, 20, 20, 0.95)';
    }
  }

  // Setup warning overlay event handlers
  setupWarningEventHandlers(url, overlay) {
    // Exit button
    const exitBtn = document.getElementById('cleverguard-exit-btn');
    if (exitBtn) {
      exitBtn.addEventListener('click', () => {
        this.exitThreat();
      });
    }

    // Proceed button (if enabled)
    const proceedBtn = document.getElementById('cleverguard-proceed-btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        this.proceedWithCaution(url);
      });
    }

    // Report button
    const reportBtn = document.getElementById('cleverguard-report-btn');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        this.reportFalsePositive(url);
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleWarningKeyboard.bind(this));

    // Prevent clicks outside warning
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        // Click on backdrop - focus back to warning
        exitBtn.focus();
      }
    });
  }

  // Handle keyboard navigation in warning
  handleWarningKeyboard(event) {
    if (!this.isWarningActive) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.exitThreat();
        break;
      case 'Tab':
        // Allow normal tab navigation within warning
        break;
      default:
        // Prevent other keyboard shortcuts
        if (event.ctrlKey || event.altKey || event.metaKey) {
          event.preventDefault();
        }
        break;
    }
  }

  // Exit threat and go back
  exitThreat() {
    this.hideWarning();
    
    // Try to go back in history
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If no history, go to a safe page
      window.location.href = 'about:blank';
    }
  }

  // Proceed with caution
  proceedWithCaution(url) {
    // Show additional warning
    const confirmed = confirm(
      '⚠️ FINAL WARNING ⚠️\n\n' +
      'You are about to visit a potentially dangerous website.\n\n' +
      'This site may:\n' +
      '• Steal your personal information\n' +
      '• Install malware on your device\n' +
      '• Trick you into revealing passwords\n\n' +
      'Are you absolutely sure you want to continue?'
    );

    if (confirmed) {
      this.hideWarning();
      // Add additional parameters to track this as a warned visit
      const warnedUrl = url + (url.includes('?') ? '&' : '?') + 'cleverguard_warned=1';
      this.navigateToUrl(warnedUrl);
    }
  }

  // Report false positive
  reportFalsePositive(url) {
    const reason = prompt(
      'Help us improve CleverGuard!\n\n' +
      'Why do you believe this is a false positive?\n' +
      '(Optional - your feedback helps us improve detection accuracy)'
    );

    // Send feedback to background script
    chrome.runtime.sendMessage({
      action: 'reportFeedback',
      feedback: {
        url: url,
        type: 'false_positive',
        reason: reason,
        timestamp: Date.now()
      }
    });

    alert('Thank you for your feedback! This will help improve CleverGuard\'s accuracy.');
  }

  // Hide warning overlay
  hideWarning() {
    const warning = document.getElementById('cleverguard-phishing-warning');
    if (warning) {
      warning.remove();
    }

    const loading = document.getElementById('cleverguard-loading');
    if (loading) {
      loading.remove();
    }

    this.isWarningActive = false;
    document.body.style.overflow = '';
    
    // Remove keyboard handler
    document.removeEventListener('keydown', this.handleWarningKeyboard);
  }

  // Navigate to URL safely
  navigateToUrl(url, target = null) {
    if (target === '_blank') {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }

  // Sanitize URL for display
  sanitizeUrl(url) {
    // Remove potentially dangerous characters for display
    return url.replace(/[<>'"]/g, '');
  }
}

// Initialize CleverGuard protection when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CleverGuardProtection();
  });
} else {
  new CleverGuardProtection();
}

console.log('CleverGuard content script loaded - v1.1 with enhanced protection'); 