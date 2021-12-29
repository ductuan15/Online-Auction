import * as React from 'react'
import { SyntheticEvent, useState } from 'react'
import Category from '../../../models/category'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'
import {
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  NavigateFunction,
  useMatch,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'
import StyledListSubheader from './StyledListSubheader'

type CategoryItemProps = {
  navigate: NavigateFunction
  category: Category
}

const CategoryItem = ({ navigate, category }: CategoryItemProps) => {
  const [open, setOpen] = useState(true)

  const categoryLink = `/product/cat/${category.id}`
  const resolved = useResolvedPath(categoryLink)
  const match = useMatch({ path: resolved.pathname, end: true })

  const onCategoryClicked = (e: SyntheticEvent) => {
    e.stopPropagation()
    navigate(categoryLink)
  }

  const handleExpand = (e: SyntheticEvent) => {
    e.stopPropagation()
    setOpen(!open)
  }

  const hasSubCategories =
    category.otherCategories && category.otherCategories.length != 0

  return (
    <React.Fragment key={category.id}>
      <ListItemButton onClick={onCategoryClicked} selected={!!match}>
        <ListItemText
          primary={category.title}
          primaryTypographyProps={{
            typography: 'button',
            letterSpacing: 0,
          }}
        />

        {hasSubCategories && open && <ExpandLess onClick={handleExpand} />}
        {category.otherCategories && !open && (
          <ExpandMore onClick={handleExpand} />
        )}
      </ListItemButton>
      {hasSubCategories && (
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding sx={{ ml: 2 }}>
            {/* recursion */}
            <CategoryTree categories={category.otherCategories} />
          </List>
        </Collapse>
      )}
    </React.Fragment>
  )
}

function CategoryTree({
  categories,
}: {
  categories?: Category[]
}): JSX.Element | null {
  const navigate = useNavigate()
  if (categories) {
    return (
      <>
        {categories.map((category) => {
          return (
            <CategoryItem
              navigate={navigate}
              category={category}
              key={category.id}
            />
          )
        })}
      </>
    )
  }

  return null
}

function CategoryList(): JSX.Element {
  const { state } = useCategoryContext()

  return (
    <List
      aria-labelledby='nested-list-subheader'
      subheader={
        <StyledListSubheader id='nested-list-subheader'>
          🏷️ Categories
        </StyledListSubheader>
      }
    >
      <Divider variant='middle' />
      <CategoryTree categories={state.allCategories} />
    </List>
  )
}

export default CategoryList
