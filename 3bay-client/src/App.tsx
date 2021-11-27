import React from 'react'
import Layout from './components/layout/Layout'
import { CategoryPage } from './pages/CategoryPage'
import ThemeConfig from './theme'

function App() {
  return (
    <ThemeConfig>
      <Layout>
        <CategoryPage />
      </Layout>
    </ThemeConfig>
  )
}

export default App
