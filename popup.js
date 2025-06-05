// CleverGuard Popup Script
// Handles settings UI and user interactions

class CleverGuardPopup {
  constructor() {
    this.settings = {
      enabled: true,
      strictMode: false,
      allowUserProceed: true
    };
    this.stats = {
      threatsBlocked: 0,
      linksChecked: 0
    };
    this.init();
  }

  async init() {
    await this.loadSettings();
    await this.loadStats();
    this.setupEventListeners();
    this.updateUI();
  }

  // Load settings from background script
  async loadSettings() {
    try {
      const response = await this.sendMessage({ action: 'getSettings' });
      this.settings = { ...this.settings, ...response };
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  // Load statistics from storage
  async loadStats() {
    try {
      const result = await chrome.storage.local.get(['cleverguardStats']);
      if (result.cleverguardStats) {
        this.stats = { ...this.stats, ...result.cleverguardStats };
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  // Save settings to background script
  async saveSettings() {
    try {
      await this.sendMessage({
        action: 'updateSettings',
        settings: this.settings
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  // Save statistics to storage
  async saveStats() {
    try {
      await chrome.storage.local.set({ cleverguardStats: this.stats });
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }

  // Send message to background script
  sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }

  // Setup event listeners
  setupEventListeners() {
    // Toggle switches
    this.setupToggle('enabledToggle', 'enabled');
    this.setupToggle('strictModeToggle', 'strictMode');
    this.setupToggle('allowProceedToggle', 'allowUserProceed');

    // Action buttons
    document.getElementById('testBtn').addEventListener('click', () => {
      this.testProtection();
    });

    document.getElementById('helpBtn').addEventListener('click', () => {
      this.showHelp();
    });
  }

  // Setup individual toggle switch
  setupToggle(elementId, settingKey) {
    const toggle = document.getElementById(elementId);
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      this.settings[settingKey] = !this.settings[settingKey];
      this.updateToggleState(toggle, this.settings[settingKey]);
      this.saveSettings();
      this.updateStatus();
    });
  }

  // Update toggle visual state
  updateToggleState(toggle, active) {
    if (active) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }

  // Update the entire UI
  updateUI() {
    this.updateToggles();
    this.updateStatus();
    this.updateStats();
  }

  // Update all toggle switches
  updateToggles() {
    const toggles = [
      { id: 'enabledToggle', key: 'enabled' },
      { id: 'strictModeToggle', key: 'strictMode' },
      { id: 'allowProceedToggle', key: 'allowUserProceed' }
    ];

    toggles.forEach(({ id, key }) => {
      const toggle = document.getElementById(id);
      if (toggle) {
        this.updateToggleState(toggle, this.settings[key]);
      }
    });
  }

  // Update status indicator
  updateStatus() {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    if (this.settings.enabled) {
      statusDot.classList.remove('disabled');
      if (this.settings.strictMode) {
        statusText.textContent = 'Strict Protection Active';
      } else {
        statusText.textContent = 'Protection Active';
      }
    } else {
      statusDot.classList.add('disabled');
      statusText.textContent = 'Protection Disabled';
    }
  }

  // Update statistics display
  updateStats() {
    const threatsElement = document.getElementById('threatsBlocked');
    const linksElement = document.getElementById('linksChecked');

    if (threatsElement) {
      threatsElement.textContent = this.formatNumber(this.stats.threatsBlocked);
    }
    if (linksElement) {
      linksElement.textContent = this.formatNumber(this.stats.linksChecked);
    }
  }

  // Format numbers for display
  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Test protection functionality
  async testProtection() {
    const testBtn = document.getElementById('testBtn');
    const originalText = testBtn.textContent;
    
    testBtn.textContent = 'Testing...';
    testBtn.disabled = true;

    try {
      // Create a test tab with a known phishing test URL
      const testUrl = 'https://phishing-example.com/test';
      
      // Open test tab
      await chrome.tabs.create({
        url: testUrl,
        active: false
      });

      // Show success message
      this.showTestResult(true, 'Test completed! Check the opened tab for the warning.');
      
      // Update stats
      this.stats.linksChecked += 1;
      await this.saveStats();
      this.updateStats();

    } catch (error) {
      console.error('Test failed:', error);
      this.showTestResult(false, 'Test failed. Please check your connection and try again.');
    } finally {
      setTimeout(() => {
        testBtn.textContent = originalText;
        testBtn.disabled = false;
      }, 2000);
    }
  }

  // Show test result
  showTestResult(success, message) {
    // Create a temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      right: 10px;
      background: ${success ? '#4CAF50' : '#f44336'};
      color: white;
      padding: 10px;
      border-radius: 8px;
      font-size: 12px;
      text-align: center;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    // Remove message after 3 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 3000);
  }

  // Show help and support
  showHelp() {
    const helpContent = `
CleverGuard Help & Support

🛡️ Features:
• Phishing Link Detection: Automatically scans links for threats
• Real-time Protection: Blocks access to dangerous websites
• Smart Analysis: Uses multiple detection methods for accuracy

⚙️ Settings:
• Enable Protection: Turn phishing detection on/off
• Strict Mode: Check ALL external links (recommended for high security)
• Allow Proceed: Let users continue with warnings (not recommended)

🔍 How it works:
1. Scans links when clicked
2. Checks against known phishing databases
3. Analyzes URL patterns for suspicious indicators
4. Shows warning overlay for dangerous sites

📊 Statistics:
• Threats Blocked: Number of phishing attempts prevented
• Links Checked: Total links analyzed for safety

🆘 Need help?
• Report false positives using the warning screen
• Contact support: support@cleverguard.security
• Documentation: docs.cleverguard.security

Version 1.0 | CleverGuard Security
    `.trim();

    alert(helpContent);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CleverGuardPopup();
});

// Add CSS animation for test result messages
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style); 