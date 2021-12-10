import React from 'react'
import ThemeConfig from './theme'
import { CategoryManagement } from './pages/admin/CategoryManagement'

function App(): JSX.Element {
  return (
    <ThemeConfig>
      <CategoryManagement />
    </ThemeConfig>
  )
}

export default App
