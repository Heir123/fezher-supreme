import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import './DarkModeToggle.css'

function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button 
      className="dark-mode-toggle"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
    >
      <div className={`toggle-track ${isDarkMode ? 'dark' : 'light'}`}>
        <div className={`toggle-thumb ${isDarkMode ? 'dark' : 'light'}`}>
          {isDarkMode ? (
            <Moon className="toggle-icon" size={14} />
          ) : (
            <Sun className="toggle-icon" size={14} />
          )}
        </div>
      </div>
    </button>
  )
}

export default DarkModeToggle