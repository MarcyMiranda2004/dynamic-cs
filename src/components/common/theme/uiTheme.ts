import {createContext, useContext} from 'react'

export const UiThemeContext = createContext<string>('')
export const useUiTheme = (): string => useContext(UiThemeContext)
