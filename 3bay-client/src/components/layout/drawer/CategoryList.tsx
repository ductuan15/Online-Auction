import * as React from 'react'
import { useEffect } from 'react'
import TreeView from '@mui/lab/TreeView'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Category from '../../../data/category'
import CategoryListItem from './CategoryListItem'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'
import axiosApiInstance from '../../../services/api'

// declare module 'react' {
//   interface CSSProperties {
//     '--tree-view-color'?: string
//     '--tree-view-bg-color'?: string
//   }
// }

function renderCategoryTree(categories?: Array<Category>): JSX.Element {
  return (
    <>
      {categories?.map((category) => (
        <CategoryListItem
          nodeId={`${category.id}`}
          key={`${category.title}`}
          category={category}
        >
          {/*recursion*/}
          {category.otherCategories &&
            renderCategoryTree(category.otherCategories)}
        </CategoryListItem>
      ))}
    </>
  )
}

function CategoryList(): JSX.Element {
  const { addAllCategories, state } = useCategoryContext()
  const [expanded, setExpanded] = React.useState<string[]>([])

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpanded(nodeIds)
  }

  useEffect(() => {
    axiosApiInstance.get(`/api/category/`).then((response) => {
      const data = response.data as Array<Category>
      addAllCategories(data)
      setExpanded([])
      setExpanded(
        state.allCategories.map((cat) => {
          return `${cat.id}`
        }),
      )
    })
  }, [])

  return (
    <TreeView
      aria-label='categories'
      expanded={expanded}
      onNodeToggle={handleToggle}
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {renderCategoryTree(state.allCategories)}
    </TreeView>
  )
}

export default CategoryList
