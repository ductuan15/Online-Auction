import React from 'react'
import Layout from './components/Layout'
import { CategoryPage } from './pages/CategoryPage'

function App() {
  return (
    <div className="App">
      <Layout>
        <CategoryPage />
      </Layout>
    </div>
  )
}

export default App
