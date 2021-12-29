import * as React from 'react'
import Avatar, { AvatarProps } from '@mui/material/Avatar'
import { Typography } from '@mui/material'
import { useDarkMode } from '../../../hooks'

function adjust(color: string, amount: number) {
  return `#${color
    .replace(/^#/, '')
    .replace(/../g, (color) =>
      (
        '0' +
        Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
      ).substr(-2),
    )}`
}

function stringToColor(string: string) {
  let hash = 0
  let i

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = '#'

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.substr(-2)
  }

  return color
}

function stringAvatar(name: string, darkTheme?: boolean) {
  const nameParts = name.split(' ')

  let avatarName = ''
  switch (nameParts.length) {
    case 0:
      break
    case 1:
      if (nameParts[0].length > 0) {
        avatarName = nameParts[0][0]
      }
      break
    default:
      if (nameParts[0].length > 0 && nameParts[1].length > 0) {
        avatarName = `${nameParts[0][0]}${nameParts[1][0]}`
      }
      break
  }

  let color = stringToColor(name)
  if (darkTheme === true) {
    color = adjust(color, 50)
  }

  return {
    sx: {
      bgcolor: color,
    },
    children: avatarName,
  }
}

type Props = {
  name: string
  fontSize?: string
} & AvatarProps

export default function BackgroundLetterAvatars({
  name,
  fontSize,
  ...avatarProps
}: Props): JSX.Element {
  const { isDarkMode } = useDarkMode()
  const nameProps = stringAvatar(name, isDarkMode)
  if (avatarProps?.sx) {
    avatarProps.sx = {
      ...avatarProps.sx,
      ...nameProps.sx,
    }
  } else {
    avatarProps.sx = nameProps.sx
  }

  return (
    <Avatar {...avatarProps}>
      {avatarProps?.children ?? (
        <Typography fontSize={fontSize}>{nameProps.children}</Typography>
      )}
    </Avatar>
  )
}
