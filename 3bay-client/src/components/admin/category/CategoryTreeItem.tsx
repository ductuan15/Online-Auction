import * as React from 'react'
import { SyntheticEvent } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { alpha, styled } from '@mui/material/styles'
import TreeItem, { treeItemClasses, TreeItemProps } from '@mui/lab/TreeItem'
import { TransitionProps } from '@mui/material/transitions'
import { animated, useSpring } from 'react-spring'
import Collapse from '@mui/material/Collapse'
import { SvgIconProps } from '@mui/material'
import Category from '../../../data/category'
import { useCategoryContext } from '../../../contexts/admin/CategoryContext'

declare module 'react' {
  // noinspection JSUnusedGlobalSymbols
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

type CategoryTreeItemProps = TreeItemProps & {
  bgColor?: string
  color?: string
  labelIcon?: React.ElementType<SvgIconProps>
  labelInfo?: string
  labelText: string
  category?: Category
}

export const StyledTreeItemRoot = styled((props: TreeItemProps) => (
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

export function CategoryTreeItem(props: CategoryTreeItemProps): JSX.Element {
  const {
    // bgColor,
    // color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    category,
    ...other
  } = props

  const { dispatch } = useCategoryContext()

  const onCategorySelected = (e: SyntheticEvent) => {
    e.stopPropagation()
    if (category) {
      dispatch({ type: 'CURRENT_CATEGORY', payload: category })
      dispatch({ type: 'OPEN_EDIT_DIALOG', payload: true })
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
