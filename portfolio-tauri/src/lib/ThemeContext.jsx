import React, { createContext, useContext, useState } from 'react'

const ThemeContext = createContext({ osTheme: 'win11', setOsTheme: () => {} })

export function OsThemeProvider({ children }) {
  const [osTheme, setOsTheme] = useState('win11')
  return (
    <ThemeContext.Provider value={{ osTheme, setOsTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useOsTheme() {
  return useContext(ThemeContext)
}
