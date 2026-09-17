import Alpine from 'alpinejs'

// ===========================
// Theme Manager
// ===========================
function themeManager() {
    return {
        isDark: false,

        /**
         * Initialize theme from localStorage or system preference.
         */
        init() {
            const saved = localStorage.getItem('theme')
            if (saved === 'dark' || saved === 'light') {
                this.isDark = saved === 'dark'
            } else {
                this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            }

            // Listen for OS-level preference changes when no saved preference
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.isDark = e.matches
                }
            })
        },

        /**
         * Toggle between dark and light theme, persisting to localStorage.
         */
        toggle() {
            this.isDark = !this.isDark
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
        },
    }
}

// Register Alpine components
Alpine.data('themeManager', themeManager)

// Start Alpine
window.Alpine = Alpine
Alpine.start()
