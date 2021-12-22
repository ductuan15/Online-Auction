import * as React from 'react'
import { SyntheticEvent, useState } from 'react'
import Category from '../../../data/category'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'
import {
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

function renderCategoryTree(categories?: Category[]): JSX.Element | null {
  if (categories) {
    const navigate = useNavigate()
    return (
      <>
        {categories.map((category) => {
          const [open, setOpen] = useState(true)
          const onCategoryClicked = (e: SyntheticEvent) => {
            e.stopPropagation()
            navigate(`/product/cat/${category.id}`)
          }

          const handleExpand = (e: SyntheticEvent) => {
            e.stopPropagation()
            setOpen(!open)
          }

          const hasSubCategories =
            category.otherCategories && category.otherCategories.length != 0

          return (
            <React.Fragment key={category.id}>
              <ListItemButton onClick={onCategoryClicked}>
                <ListItemText
                  primary={category.title}
                  primaryTypographyProps={{
                    color: 'text.secondary',
                    typography: 'subtitle',
                    letterSpacing: 0,
                  }}
                />

                {hasSubCategories && open && (
                  <ExpandLess onClick={handleExpand} />
                )}
                {category.otherCategories && !open && (
                  <ExpandMore onClick={handleExpand} />
                )}
              </ListItemButton>
              {hasSubCategories && (
                <Collapse in={open} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding sx={{ ml: 2 }}>
                    {/* recursion */}
                    {renderCategoryTree(category.otherCategories)}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
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
        <ListSubheader component='div' id='nested-list-subheader'>
          🏷️ Categories
        </ListSubheader>
      }
    >
      <Divider variant='middle' />
      {renderCategoryTree(state.allCategories)}
    </List>
  )
}

export default CategoryList
