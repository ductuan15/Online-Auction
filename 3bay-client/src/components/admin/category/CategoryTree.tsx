import * as React from 'react'
import { SyntheticEvent } from 'react'
import { alpha, styled } from '@mui/material/styles'
import TreeView from '@mui/lab/TreeView'
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem'
import Collapse from '@mui/material/Collapse'
import { animated, useSpring } from 'react-spring'
import { TransitionProps } from '@mui/material/transitions'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Category from '../../../data/category'
import EditIcon from '@mui/icons-material/Edit'
import { SvgIconProps } from '@mui/material'

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string
    '--tree-view-bg-color'?: string
  }
}

function TransitionComponent(props: TransitionProps): JSX.Element {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: 'translate3d(20px,0,0)',
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  })

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  )
}

const StyledTreeItemRoot = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,

    borderRadius: 5,

    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),

    fontWeight: theme.typography.fontWeightRegular,
    '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: 'var(--tree-view-color)',
      fontWeight: theme.typography.fontWeightMedium,
    },
    [`& .${treeItemClasses.label}`]: {
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.body1.fontSize,
      },
      fontSize: theme.typography.h5.fontSize,
      fontWeight: 'inherit',
      color: 'inherit',
    },
  },
}))

function CategoryTreeItem(props: CategoryTreeItemProps): JSX.Element {
  const {
    // bgColor,
    // color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    category,
    onCategorySelected: onCategorySelectedCallback,
    ...other
  } = props

  const onCategorySelected = (e: SyntheticEvent) => {
    e.stopPropagation()
    if (category && onCategorySelectedCallback) {
      onCategorySelectedCallback(category)
    }
  }

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '#labelIcon': {
              display: 'none',
            },
            ':hover #labelIcon': {
              display: 'block',
            },
          }}
        >
          <Box color='inherit' />
          <Typography
            sx={(theme) => ({
              fontWeight: 'inherit',
              flexGrow: 1,
              [theme.breakpoints.down('sm')]: {
                typography: 'body1',
              },
              typography: 'h5',
            })}
          >
            {labelText}
          </Typography>

          <Typography variant='caption' color='inherit'>
            {labelInfo}
          </Typography>

          <Box
            id='labelIcon'
            component={LabelIcon}
            sx={{}}
            onClick={onCategorySelected}
          />
        </Box>
      }
      // style={{
      //   '--tree-view-color': color,
      //   '--tree-view-bg-color': bgColor,
      // }}
      {...other}
    />
  )
}

type CategoryTreeItemProps = TreeItemProps & {
  bgColor?: string
  color?: string
  labelIcon?: React.ElementType<SvgIconProps>
  labelInfo?: string
  labelText: string
  category?: Category
  onCategorySelected?: (category: Category) => void
}

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
