import React from 'react'
import Layout from './components/layout/Layout'
import ThemeConfig from './theme'
import { CategoryManagement } from './pages/admin/CategoryManagement'

function App(): JSX.Element {
  return (
    <ThemeConfig>
      <Layout>
        <CategoryManagement />
      </Layout>
    </ThemeConfig>
  )
}

export default App
