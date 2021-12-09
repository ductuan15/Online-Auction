import * as React from 'react'
import TreeView from '@mui/lab/TreeView'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Category from '../../../data/category'
import EditIcon from '@mui/icons-material/Edit'
import { CategoryTreeItem, StyledTreeItemRoot } from './CategoryTreeItem'

type CategoryTreeProps = {
  categories?: Array<Category>
  onCategorySelected?: (category: Category) => void
}

function renderCategoryTree(
  categories?: Array<Category>,
  onCategorySelected?: (category: Category) => void,
): JSX.Element {
  return (
    <>
      {categories?.map((category) => (
        <CategoryTreeItem
          nodeId={`${category.id}`}
          labelText={category.title}
          key={`${category.title}`}
          labelIcon={EditIcon}
          category={category}
          onCategorySelected={onCategorySelected}
        >
          {/*recursion*/}
          {category.otherCategories &&
            renderCategoryTree(category.otherCategories, onCategorySelected)}
        </CategoryTreeItem>
      ))}
    </>
  )
}

export default function CategoryTree({
  categories,
  onCategorySelected,
}: CategoryTreeProps): JSX.Element {
  return (
    <TreeView
      aria-label='customized'
      defaultExpanded={['1']}
      defaultCollapseIcon={<KeyboardArrowUpIcon />}
      defaultExpandIcon={<KeyboardArrowDownIcon />}
      sx={(theme) => ({
        [theme.breakpoints.up('lg')]: {
          maxWidth: 0.75,
        },
        [theme.breakpoints.only('md')]: {
          maxWidth: 0.85,
        },
        [theme.breakpoints.down('sm')]: {
          maxWidth: 1,
        },
        flexGrow: 1,
        overflowY: 'auto',
        color: theme.palette.text.primary,
      })}
    >
      <StyledTreeItemRoot nodeId='-1' label='All categories'>
        {renderCategoryTree(categories, onCategorySelected)}
      </StyledTreeItemRoot>
    </TreeView>
  )
}
