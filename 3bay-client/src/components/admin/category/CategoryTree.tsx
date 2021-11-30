import * as React from 'react'
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
import { SvgIconProps } from '@mui/material'
import Category from '../../../data/category'
import EditIcon from '@mui/icons-material/Edit'

declare module 'react' {
  interface CSSProperties {
    '--tree-view-color'?: string
    '--tree-view-bg-color'?: string
  }
}

function TransitionComponent(props: TransitionProps) {
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

function CategoryTreeItem(props: StyledTreeItemProps) {
  const {
    // bgColor,
    // color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props

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
          <Box color="inherit" />
          <Typography sx={(theme) => ({
            fontWeight: 'inherit', flexGrow: 1,
            [theme.breakpoints.down('sm')]: {
              typography: 'body1'
            },
            typography: 'h5'
          })}>
            {labelText}
          </Typography>

          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>

          <Box id="labelIcon" component={LabelIcon} sx={{}} />
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

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string
  color?: string
  labelIcon?: React.ElementType<SvgIconProps>
  labelInfo?: string
  labelText: string
}

type CategoryTreeProps = {
  categories?: Array<Category>
}

function renderCategoryTree(categories?: Array<Category>) {
  return (
    <div>
      {categories?.map((category) => (
        <CategoryTreeItem
          nodeId={`${category.id}`}
          labelText={category.title}
          key={`${category.title}`}
          labelIcon={EditIcon}
        >
          {/*recursion*/}
          {category.other_categories &&
            renderCategoryTree(category.other_categories)}
        </CategoryTreeItem>
      ))}
    </div>
  )
}

export default function CategoryTree({ categories }: CategoryTreeProps) {
  return (
    <TreeView
      aria-label="customized"
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
      <StyledTreeItemRoot nodeId="-1" label="All categories">
        {renderCategoryTree(categories)}
      </StyledTreeItemRoot>
    </TreeView>
  )
}
