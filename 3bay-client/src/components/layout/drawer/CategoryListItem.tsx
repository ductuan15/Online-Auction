import { styled } from '@mui/material/styles'
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { SyntheticEvent } from 'react'
import { SvgIconProps } from '@mui/material/SvgIcon'
import Category from '../../../data/category'
import { useNavigate } from 'react-router-dom'

type CategoryListItemProps = TreeItemProps & {
  bgColor?: string
  color?: string
  labelIcon?: React.ElementType<SvgIconProps>
  category: Category
}

const CategoryListItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    // color: theme.palette.text.secondary,
    paddingRight: theme.spacing(1),
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}))

function CategoryListItem(props: CategoryListItemProps) {
  const { bgColor, color, category, ...other } = props
  const navigate = useNavigate()

  const onCategoryClicked = (e: SyntheticEvent) => {
    e.stopPropagation()
    navigate(`/product/cat/${category.id}`)
  }
  return (
    <CategoryListItemRoot
      label={
        <Box
          sx={{ display: 'flex', alignItems: 'center', p: 1, py: 1.25 }}
          onClick={onCategoryClicked}
        >
          <Typography
            variant='body2'
            sx={{ fontWeight: 'inherit', flexGrow: 1 }}
          >
            {category.title}
          </Typography>
        </Box>
      }
      style={{
        '--tree-view-color': color,
        '--tree-view-bg-color': bgColor,
      }}
      {...other}
    />
  )
}

export default CategoryListItem
