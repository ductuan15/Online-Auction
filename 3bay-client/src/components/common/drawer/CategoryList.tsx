import * as React from 'react'
import {SyntheticEvent, useCallback, useMemo, useState} from 'react'
import Category from '../../../models/category'
import { useCategoryContext } from '../../../contexts/layout/CategoryContext'
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
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import StyledListSubheader from './StyledListSubheader'

type CategoryItemProps = {
  navigate: NavigateFunction
  category: Category
}

const CategoryItem = ({ navigate, category }: CategoryItemProps) => {
  const [open, setOpen] = useState(true)
  const categoryLink = useMemo(() => {
    return `/products/search/?key=&categoryId=${category.id}&sortBy=closeTime&sortType=desc&page=1`
  }, [category.id])

  const [searchParams] = useSearchParams()
  const categoryIdParam = searchParams.get('categoryId')

  const onCategoryClicked = useCallback(() => {
    // e.stopPropagation()
    navigate(categoryLink)
  }, [categoryLink, navigate])

  const handleExpand = useCallback((e: SyntheticEvent) => {
    e.stopPropagation()
    setOpen(!open)
  }, [open])

  const hasSubCategories = useMemo(() => {
    return category.otherCategories && category.otherCategories.length != 0
  }, [category.otherCategories])

  return (
    <React.Fragment key={category.id}>
      <ListItemButton
        onClick={onCategoryClicked}
        selected={categoryIdParam === `${category.id}`}
      >
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
