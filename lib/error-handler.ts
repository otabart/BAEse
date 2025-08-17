// Error handler for Chrome extension runtime errors
export function handleChromeExtensionErrors() {
    if (typeof window !== 'undefined') {
        // Suppress Chrome extension runtime errors
        const originalError = window.console.error;
        window.console.error = (...args) => {
            // Check if the error is related to Chrome extension runtime
            const errorMessage = args[0]?.toString() || '';
            if (
                errorMessage.includes('chrome.runtime.sendMessage') ||
                errorMessage.includes('Extension ID') ||
                errorMessage.includes('chrome-extension://')
            ) {
                // Silently ignore Chrome extension errors
                return;
            }
            // Log other errors normally
            originalError.apply(console, args);
        };

        // Handle unhandled promise rejections from extensions
        window.addEventListener('unhandledrejection', (event) => {
            const error = event.reason?.toString() || '';
            if (
                error.includes('chrome.runtime.sendMessage') ||
                error.includes('Extension ID') ||
                error.includes('chrome-extension://')
            ) {
                event.preventDefault();
                return;
            }
        });

        // Handle general errors from extensions
        window.addEventListener('error', (event) => {
            const error = event.error?.toString() || event.message || '';
            if (
                error.includes('chrome.runtime.sendMessage') ||
                error.includes('Extension ID') ||
                error.includes('chrome-extension://')
            ) {
                event.preventDefault();
                return;
            }
        });
    }
}

// Call this function early in your app
if (typeof window !== 'undefined') {
    handleChromeExtensionErrors();
}
