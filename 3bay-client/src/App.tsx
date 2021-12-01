import React from 'react'
import Layout from './components/layout/Layout'
import ThemeConfig from './theme'
import { CategoryManagementPage } from './pages/admin/CategoryManagementPage'

function App(): JSX.Element {
  return (
    <ThemeConfig>
      <Layout>
        <CategoryManagementPage />
      </Layout>
    </ThemeConfig>
  )
}

export default App
