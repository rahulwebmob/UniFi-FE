import type { Theme } from '@mui/material/styles'

import { alpha, styled } from '@mui/material/styles'

interface UserProfileProps {
  height?: string | number
}

const UserProfile = styled('div')<UserProfileProps>(
  ({ theme, height }: { theme: Theme; height?: string | number }) => ({
    '& .tab-custom': {
      height,
      overflowY: 'auto',
      backgroundColor: theme.palette.primary.light,
      padding: '16px 0px 16px 16px',
      borderRadius: '12px 0px 0px 12px',
      '& .MuiTabs-root': {
        '& svg': { margin: 0 },
        '& .MuiTab-iconWrapper': {
          marginRight: '10px',
        },
        '& .MuiButtonBase-root': {
          padding: '12px 16px',
          textTransform: 'capitalize',
          maxWidth: '100%',
          marginBottom: '10px',
          gap: '10px',
        },
        '& .Mui-selected': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.dark,
          borderRadius: '8px 0px 0px 8px',
        },
      },
      '& .MuiTab-labelIcon': {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        textAlign: 'start',
        minHeight: 'auto',
      },
    },
    '& .tabRightSide': {
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.not('xs')]: {
        borderRadius: '0px 12px 12px 0px',
      },
      [theme.breakpoints.only('xs')]: {
        borderRadius: '12px',
      },
    },
    '& .tabHeader': {
      padding: '16.7px 12px',
      borderBottom: `1px solid ${theme.palette.primary.main}`,
    },
    '& .username': {
      mb: 2,
    },
    '& .MuiFormControl-root': {
      '& .MuiInputBase-root': {
        borderRadius: '8px',
        '& .MuiInputBase-input': {
          color: theme.palette.secondary.main,
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderWidth: '0',
        },
      },
    },
    '& .MuiChip-root': {
      color: theme.palette.grey[300],
      '& .MuiSvgIcon-root': {
        color: theme.palette.grey[300],
        fontSize: '0.75em',
      },
    },
    '& .interest-box input': {
      width: '60px',
      padding: '4px',
      borderRadius: '80px',
    },
    '& .dropdown-Button': {
      color: theme.palette.grey[300],
      fontSize: '1.875em',
      position: 'relative',
      left: '68px',
      top: '-40px',
      backgroundColor: 'transparent !important',
    },
    '& .media-Box': {
      color: alpha(theme.palette.text.primary, 0.5),
      width: '100%',
      background: theme.palette.primary.light,
      borderRadius: '10px',
      padding: '9.5px 14px',
      a: {
        textDecoration: 'none',
        color: theme.palette.text.primary,
      },
    },
    '& .tab-Heading': {
      color: theme.palette.text.primary,
    },
    '& .custom-textarea': {
      borderRadius: '8px',
      padding: '8px 12px 8px 12px',
      background: theme.palette.primary.light,
      color: theme.palette.secondary.main,
      border: 'none',
    },
    '& .profileTitle': {
      color: theme.palette.primary.main,
      marginBottom: '16px',
    },
  }),
)
const UserProfile1 = styled('div')(() => ({}))

export { UserProfile, UserProfile1 }
