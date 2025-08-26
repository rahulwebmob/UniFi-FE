/* ===== START: Alert Components ===== */
export const MuiAlert = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.spacing(1.5),
      padding: theme.spacing(1.5, 2),
      fontSize: '0.875rem',
      alignItems: 'center',
      border: 'none',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    }),

    icon: ({ theme }) => ({
      padding: 0,
      marginRight: theme.spacing(1.5),
      fontSize: '1.25rem',
      opacity: 1,
    }),

    message: {
      padding: 0,
      fontWeight: 500,
      lineHeight: 1.6,
    },

    action: ({ theme }) => ({
      padding: 0,
      paddingLeft: theme.spacing(2),
      marginRight: 0,
      alignItems: 'center',
    }),

    standardSuccess: ({ theme }) => ({
      backgroundColor: theme.palette.success[50],
      color: theme.palette.success[900],

      '& .MuiAlert-icon': {
        color: theme.palette.success.main,
      },
    }),

    standardError: ({ theme }) => ({
      backgroundColor: theme.palette.error[50],
      color: theme.palette.error[900],

      '& .MuiAlert-icon': {
        color: theme.palette.error.main,
      },
    }),

    standardWarning: ({ theme }) => ({
      backgroundColor: theme.palette.warning[50],
      color: theme.palette.warning[900],

      '& .MuiAlert-icon': {
        color: theme.palette.warning.main,
      },
    }),

    standardInfo: ({ theme }) => ({
      backgroundColor: theme.palette.info[50],
      color: theme.palette.info[900],

      '& .MuiAlert-icon': {
        color: theme.palette.info.main,
      },
    }),

    filledSuccess: ({ theme }) => ({
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
      fontWeight: 500,

      '& .MuiAlert-icon': {
        color: theme.palette.success.contrastText,
      },
    }),

    filledError: ({ theme }) => ({
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      fontWeight: 500,

      '& .MuiAlert-icon': {
        color: theme.palette.error.contrastText,
      },
    }),

    filledWarning: ({ theme }) => ({
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
      fontWeight: 500,

      '& .MuiAlert-icon': {
        color: theme.palette.warning.contrastText,
      },
    }),

    filledInfo: ({ theme }) => ({
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
      fontWeight: 500,

      '& .MuiAlert-icon': {
        color: theme.palette.info.contrastText,
      },
    }),

    outlinedSuccess: ({ theme }) => ({
      color: theme.palette.success[800],
      border: `1px solid ${theme.palette.success[200]}`,
      backgroundColor: 'transparent',

      '& .MuiAlert-icon': {
        color: theme.palette.success.main,
      },
    }),

    outlinedError: ({ theme }) => ({
      color: theme.palette.error[800],
      border: `1px solid ${theme.palette.error[200]}`,
      backgroundColor: 'transparent',

      '& .MuiAlert-icon': {
        color: theme.palette.error.main,
      },
    }),

    outlinedWarning: ({ theme }) => ({
      color: theme.palette.warning[800],
      border: `1px solid ${theme.palette.warning[200]}`,
      backgroundColor: 'transparent',

      '& .MuiAlert-icon': {
        color: theme.palette.warning.main,
      },
    }),

    outlinedInfo: ({ theme }) => ({
      color: theme.palette.info[800],
      border: `1px solid ${theme.palette.info[200]}`,
      backgroundColor: 'transparent',

      '& .MuiAlert-icon': {
        color: theme.palette.info.main,
      },
    }),
  },
}

export const MuiAlertTitle = {
  styleOverrides: {
    root: ({ theme }) => ({
      marginTop: 0,
      marginBottom: theme.spacing(0.5),
      fontWeight: 600,
      fontSize: '0.9375rem',
      lineHeight: 1.4,
    }),
  },
}

export const MuiSnackbar = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiPaper-root': {
        borderRadius: theme.spacing(1.5),
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    }),

    anchorOriginTopCenter: ({ theme }) => ({
      top: theme.spacing(3),

      [theme.breakpoints.up('sm')]: {
        top: theme.spacing(3),
      },
    }),

    anchorOriginBottomCenter: ({ theme }) => ({
      bottom: theme.spacing(3),

      [theme.breakpoints.up('sm')]: {
        bottom: theme.spacing(3),
      },
    }),

    anchorOriginTopRight: ({ theme }) => ({
      top: theme.spacing(3),
      right: theme.spacing(3),

      [theme.breakpoints.up('sm')]: {
        top: theme.spacing(3),
        right: theme.spacing(3),
      },
    }),

    anchorOriginBottomRight: ({ theme }) => ({
      bottom: theme.spacing(3),
      right: theme.spacing(3),

      [theme.breakpoints.up('sm')]: {
        bottom: theme.spacing(3),
        right: theme.spacing(3),
      },
    }),

    anchorOriginTopLeft: ({ theme }) => ({
      top: theme.spacing(3),
      left: theme.spacing(3),

      [theme.breakpoints.up('sm')]: {
        top: theme.spacing(3),
        left: theme.spacing(3),
      },
    }),

    anchorOriginBottomLeft: ({ theme }) => ({
      bottom: theme.spacing(3),
      left: theme.spacing(3),

      [theme.breakpoints.up('sm')]: {
        bottom: theme.spacing(3),
        left: theme.spacing(3),
      },
    }),
  },
}

export const MuiSnackbarContent = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.common.white,
      fontSize: '0.875rem',
      fontWeight: 500,
      padding: theme.spacing(1.5, 2),
      minWidth: 288,
      flexGrow: 0,

      [theme.breakpoints.up('sm')]: {
        minWidth: 344,
      },
    }),

    message: {
      padding: 0,
      lineHeight: 1.6,
    },

    action: ({ theme }) => ({
      paddingLeft: theme.spacing(2),
      marginRight: 0,
    }),
  },
}
/* ===== END: Alert Components ===== */

/* ===== START: Avatar Components ===== */
export const MuiAvatar = {
  styleOverrides: {
    root: ({ theme }) => ({
      width: 40,
      height: 40,
      fontSize: '1rem',
      fontWeight: 500,
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.text.primary,
    }),

    colorDefault: ({ theme }) => ({
      backgroundColor: theme.palette.grey[200],
      color: theme.palette.text.primary,
    }),

    rounded: ({ theme }) => ({
      borderRadius: theme.spacing(1.5),
    }),

    square: ({ theme }) => ({
      borderRadius: theme.spacing(1),
    }),

    img: {
      objectFit: 'cover',
    },
  },
}

export const MuiAvatarGroup = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiAvatar-root': {
        border: `2px solid ${theme.palette.background.paper}`,
        marginLeft: theme.spacing(-1),

        '&:first-of-type': {
          marginLeft: 0,
        },
      },
    }),
  },
}
/* ===== END: Avatar Components ===== */

/* ===== START: Badge Component ===== */
export const MuiBadge = {
  styleOverrides: {
    root: () => ({
      '& .MuiBadge-badge': {
        fontSize: '0.75rem',
        fontWeight: 600,
        minWidth: 20,
        height: 20,
        padding: '0 6px',
        borderRadius: 10,
      },
    }),

    standard: ({ theme }) => ({
      '&.MuiBadge-colorPrimary .MuiBadge-badge': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },

      '&.MuiBadge-colorSecondary .MuiBadge-badge': {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
      },

      '&.MuiBadge-colorError .MuiBadge-badge': {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
      },

      '&.MuiBadge-colorWarning .MuiBadge-badge': {
        backgroundColor: theme.palette.warning.main,
        color: theme.palette.warning.contrastText,
      },

      '&.MuiBadge-colorInfo .MuiBadge-badge': {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.info.contrastText,
      },

      '&.MuiBadge-colorSuccess .MuiBadge-badge': {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
      },
    }),

    dot: ({ theme }) => ({
      '& .MuiBadge-badge': {
        minWidth: 8,
        height: 8,
        padding: 0,
        borderRadius: 4,
        border: `2px solid ${theme.palette.background.paper}`,
      },
    }),

    anchorOriginTopRight: {
      '&.MuiBadge-overlapCircular .MuiBadge-badge': {
        top: '14%',
        right: '14%',
        transform: 'scale(1) translate(50%, -50%)',
      },

      '&.MuiBadge-overlapRectangular .MuiBadge-badge': {
        top: 0,
        right: 0,
        transform: 'scale(1) translate(50%, -50%)',
      },
    },
  },
}
/* ===== END: Badge Component ===== */

/* ===== START: Button Component ===== */
export const MuiButton = {
  defaultProps: {
    disableElevation: true,
    disableRipple: false,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.spacing(1),
      padding: `${theme.spacing(1.5)} ${theme.spacing(3)}`,
      fontWeight: 600,
      transition: 'all 0.2s ease-in-out',
      textTransform: 'none',
      '&:focus-visible': {
        outline: 'none',
      },
    }),

    sizeLarge: ({ theme }) => ({
      padding: `${theme.spacing(2)} ${theme.spacing(4)}`,
      fontSize: '1rem',
    }),

    sizeSmall: ({ theme }) => ({
      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
      fontSize: '0.8125rem',
    }),

    contained: ({ theme }) => ({
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: '0 2px 4px rgba(17, 66, 98, 0.15)',
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary[700]} 100%)`,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        background: `linear-gradient(135deg, ${theme.palette.primary[700]} 0%, ${theme.palette.primary[800]} 100%)`,
        boxShadow: '0 6px 20px rgba(17, 66, 98, 0.25)',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: '0 2px 8px rgba(17, 66, 98, 0.2)',
      },
    }),

    containedSecondary: ({ theme }) => ({
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary[700]} 100%)`,
      boxShadow: '0 2px 4px rgba(32, 133, 68, 0.15)',
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        background: `linear-gradient(135deg, ${theme.palette.secondary[700]} 0%, ${theme.palette.secondary[800]} 100%)`,
        boxShadow: '0 6px 20px rgba(32, 133, 68, 0.25)',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: '0 2px 8px rgba(32, 133, 68, 0.2)',
      },
    }),

    containedError: ({ theme }) => ({
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error[700]} 100%)`,
      boxShadow: '0 2px 4px rgba(211, 47, 47, 0.15)',
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
        background: `linear-gradient(135deg, ${theme.palette.error[700]} 0%, ${theme.palette.error[800]} 100%)`,
        boxShadow: '0 6px 20px rgba(211, 47, 47, 0.25)',
        transform: 'translateY(-2px)',
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)',
      },
      '&:disabled': {
        background: 'none',
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled,
      },
    }),

    outlined: ({ theme }) => ({
      borderColor: theme.palette.divider,
      borderWidth: 1.5,
      '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: `${theme.palette.primary.main}08`,
        borderWidth: 1.5,
      },
    }),

    outlinedPrimary: ({ theme }) => ({
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      '&:hover': {
        borderColor: theme.palette.primary.dark,
        backgroundColor: `${theme.palette.primary.main}08`,
      },
    }),

    outlinedError: ({ theme }) => ({
      borderColor: theme.palette.error.main,
      color: theme.palette.error.main,
      '&:hover': {
        borderColor: theme.palette.error.dark,
        backgroundColor: `${theme.palette.error.main}08`,
      },
    }),

    text: ({ theme }) => ({
      color: theme.palette.text.primary,
      '&:hover': {
        backgroundColor: `${theme.palette.action.hover}`,
      },
    }),

    textPrimary: ({ theme }) => ({
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main}08`,
      },
    }),

    textError: ({ theme }) => ({
      color: theme.palette.error.main,
      '&:hover': {
        backgroundColor: `${theme.palette.error.main}08`,
      },
    }),
  },
}
/* ===== END: Button Component ===== */

/* ===== START: Card Components ===== */
export const MuiCard = {
  defaultProps: {
    elevation: 0,
  },
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.spacing(2),
      border: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',

      '&:hover': {
        boxShadow: '0 10px 40px rgba(17, 66, 98, 0.08), 0 2px 10px rgba(17, 66, 98, 0.04)',
        transform: 'translateY(-3px)',
      },
    }),
  },
}

export const MuiCardContent = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),

      '&:last-child': {
        paddingBottom: theme.spacing(3),
      },
    }),
  },
}

export const MuiCardActions = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(2, 3),
      borderTop: `1px solid ${theme.palette.divider}`,
      backgroundColor: `${theme.palette.grey[50]}`,
    }),
  },
}

export const MuiCardMedia = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: `${theme.spacing(2)} ${theme.spacing(2)} 0 0`,
    }),
  },
}
/* ===== END: Card Components ===== */

/* ===== START: Chip Component ===== */
export const MuiChip = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: '100px', // Fully rounded for modern look
      height: 32,
      padding: '0 12px', // Reduced padding
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.025em',
      transition: 'none',
      border: 'none',
      position: 'relative',
      overflow: 'hidden',

      // Gradient variants - use by adding className
      '&.MuiChip-gradientPrimary': {
        background: theme.gradients?.primary || theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
      '&.MuiChip-gradientOcean': {
        background: theme.gradients?.ocean || theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
      '&.MuiChip-gradientForest': {
        background: theme.gradients?.forest || theme.palette.secondary.main,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
      '&.MuiChip-gradientSunset': {
        background: theme.gradients?.sunset || theme.palette.warning.main,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
      '&.MuiChip-gradientAurora': {
        background: theme.gradients?.aurora || theme.palette.info.main,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
      '&.MuiChip-gradientHealth': {
        background: theme.gradients?.health || theme.palette.success.main,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
    }),

    sizeSmall: ({ theme }) => ({
      height: 24,
      fontSize: '0.75rem',

      '& .MuiChip-icon': {
        fontSize: '1rem',
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(-0.5),
      },

      '& .MuiChip-deleteIcon': {
        fontSize: '1rem',
        marginRight: theme.spacing(0.5),
        marginLeft: theme.spacing(-0.5),
      },
    }),

    sizeMedium: ({ theme }) => ({
      '& .MuiChip-icon': {
        fontSize: '1.25rem',
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(-0.75),
      },

      '& .MuiChip-deleteIcon': {
        fontSize: '1.125rem',
        marginRight: theme.spacing(1),
        marginLeft: theme.spacing(-0.75),
      },
    }),

    label: ({ theme }) => ({
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      letterSpacing: '0.01em',
    }),

    filled: ({ theme }) => ({
      background: `linear-gradient(135deg, ${theme.palette.grey[400]} 0%, ${theme.palette.grey[200]} 100%)`,
      color: theme.palette.grey[900],
      fontWeight: 600,
    }),

    outlined: ({ theme }) => ({
      backgroundColor: 'transparent',
      borderColor: theme.palette.grey[400],
      color: theme.palette.text.primary,
      borderWidth: 1.5,
      borderStyle: 'solid',
      fontWeight: 600,
    }),

    filledPrimary: ({ theme }) => ({
      background: `linear-gradient(135deg, ${theme.palette.primary[700]} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary[400]} 100%)`,
      color: theme.palette.common.white,
      fontWeight: 600,

      '& .MuiChip-deleteIcon': {
        color: theme.palette.common.white,
        opacity: 0.8,
      },
    }),

    filledSecondary: ({ theme }) => ({
      background: `linear-gradient(135deg, ${theme.palette.secondary[700]} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.secondary[400]} 100%)`,
      color: theme.palette.common.white,
      fontWeight: 600,

      '& .MuiChip-deleteIcon': {
        color: theme.palette.common.white,
        opacity: 0.8,
      },
    }),

    // Dark gradient support for success, error, warning, info
    colorSuccess: ({ theme }) => ({
      '&.MuiChip-filled': {
        background: `linear-gradient(135deg, ${theme.palette.success[700]} 0%, ${theme.palette.success[600]} 50%, ${theme.palette.success[500]} 100%)`,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
      '&.MuiChip-outlined': {
        borderColor: theme.palette.success.main,
        borderWidth: 1.5,
        color: theme.palette.success.main,
        fontWeight: 600,
      },
    }),

    colorError: ({ theme }) => ({
      '&.MuiChip-filled': {
        background: `linear-gradient(135deg, ${theme.palette.error[700]} 0%, ${theme.palette.error.main} 50%, ${theme.palette.error[400]} 100%)`,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
      '&.MuiChip-outlined': {
        borderColor: theme.palette.error.main,
        borderWidth: 1.5,
        color: theme.palette.error.main,
        fontWeight: 600,
      },
    }),

    colorWarning: ({ theme }) => ({
      '&.MuiChip-filled': {
        background: `linear-gradient(135deg, ${theme.palette.warning[700]} 0%, ${theme.palette.warning.main} 50%, ${theme.palette.warning[400]} 100%)`,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
      '&.MuiChip-outlined': {
        borderColor: theme.palette.warning.main,
        borderWidth: 1.5,
        color: theme.palette.warning[700],
        fontWeight: 600,
      },
    }),

    colorInfo: ({ theme }) => ({
      '&.MuiChip-filled': {
        background: `linear-gradient(135deg, ${theme.palette.info[700]} 0%, ${theme.palette.info.main} 50%, ${theme.palette.info[400]} 100%)`,
        color: theme.palette.common.white,
        fontWeight: 600,
      },
      '&.MuiChip-outlined': {
        borderColor: theme.palette.info.main,
        borderWidth: 1.5,
        color: theme.palette.info.main,
        fontWeight: 600,
      },
    }),

    outlinedPrimary: ({ theme }) => ({
      borderColor: theme.palette.primary.main,
      borderWidth: 1.5,
      color: theme.palette.primary.main,
      fontWeight: 600,
    }),

    outlinedSecondary: ({ theme }) => ({
      borderColor: theme.palette.secondary.main,
      borderWidth: 1.5,
      color: theme.palette.secondary.main,
      fontWeight: 600,
    }),

    clickable: () => ({
      cursor: 'pointer',
      userSelect: 'none',
    }),

    icon: () => ({
      color: 'inherit',
    }),

    deleteIcon: ({ theme }) => ({
      fontSize: '1.125rem',
      color: 'inherit',
      opacity: 0.5,
      transition: 'all 0.2s ease',

      '&:hover': {
        opacity: 0.8,
        color: theme.palette.error.main,
      },
    }),
  },
}
/* ===== END: Chip Component ===== */

/* ===== START: Dialog Components ===== */
export const MuiDialog = {
  styleOverrides: {
    root: {
      '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
      },
    },

    paper: ({ theme }) => ({
      borderRadius: theme.spacing(2),
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      backgroundImage: 'none',
      overflow: 'visible',
    }),

    paperScrollPaper: ({ theme }) => ({
      maxHeight: 'calc(100% - 128px)',
      margin: theme.spacing(8),

      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(2),
        maxHeight: 'calc(100% - 32px)',
      },
    }),

    paperWidthSm: () => ({
      maxWidth: 444,
    }),

    paperWidthMd: () => ({
      maxWidth: 600,
    }),

    paperWidthLg: () => ({
      maxWidth: 800,
    }),

    paperFullScreen: {
      borderRadius: 0,
    },
  },
}

export const MuiDialogTitle = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: theme.palette.text.primary,

      '& + .MuiDialogContent-root': {
        paddingTop: 0,
      },
    }),
  },
}

export const MuiDialogContent = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
      overflowY: 'auto',

      '&:first-of-type': {
        paddingTop: theme.spacing(3),
      },
    }),

    dividers: ({ theme }) => ({
      borderTop: `1px solid ${theme.palette.grey[200]}`,
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    }),
  },
}

export const MuiDialogContentText = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.secondary,
      fontSize: '0.875rem',
      lineHeight: 1.6,
      marginBottom: theme.spacing(2),

      '&:last-child': {
        marginBottom: 0,
      },
    }),
  },
}

export const MuiDialogActions = {
  styleOverrides: {
    root: ({ theme }) => ({
      padding: theme.spacing(3),
      gap: theme.spacing(1),

      '& > :not(:first-of-type)': {
        marginLeft: 0,
      },
    }),

    spacing: () => ({
      '& > :not(:first-of-type)': {
        marginLeft: 0,
      },
    }),
  },
}
/* ===== END: Dialog Components ===== */

/* ===== START: Navigation Components ===== */
export const MuiAppBar = {
  styleOverrides: {
    root: ({ theme }) => ({
      boxShadow: 'none',
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
      backgroundColor: theme.palette.background.paper,
      backgroundImage: 'none',
      backdropFilter: 'blur(8px)',
    }),

    colorPrimary: ({ theme }) => ({
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderBottom: 'none',
    }),

    colorTransparent: ({ theme }) => ({
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    }),
  },
}

export const MuiToolbar = {
  styleOverrides: {
    root: ({ theme }) => ({
      minHeight: 64,

      [theme.breakpoints.up('sm')]: {
        minHeight: 64,
      },
    }),

    gutters: ({ theme }) => ({
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),

      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    }),
  },
}

export const MuiDrawer = {
  styleOverrides: {
    root: {
      '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      },
    },

    paper: ({ theme }) => ({
      backgroundColor: theme.palette.background.paper,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      backgroundImage: 'none',
      borderRight: 'none',
    }),

    paperAnchorLeft: () => ({
      borderRight: 'none',
    }),

    paperAnchorRight: () => ({
      borderLeft: 'none',
    }),

    paperAnchorTop: () => ({
      borderBottom: 'none',
    }),

    paperAnchorBottom: () => ({
      borderTop: 'none',
    }),
  },
}

export const MuiList = {
  styleOverrides: {
    root: {
      padding: 0,
    },

    padding: ({ theme }) => ({
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    }),
  },
}

export const MuiListItem = {
  styleOverrides: {
    root: ({ theme }) => ({
      '&.Mui-selected': {
        backgroundColor: `${theme.palette.primary.main}08`,

        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}12`,
        },
      },
    }),

    gutters: ({ theme }) => ({
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    }),
  },
}

export const MuiListItemButton = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      transition: 'all 0.2s ease',

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },

      '&.Mui-selected': {
        backgroundColor: `${theme.palette.primary.main}08`,

        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}12`,
        },

        '& .MuiListItemIcon-root': {
          color: theme.palette.primary.main,
        },

        '& .MuiListItemText-primary': {
          color: theme.palette.primary.main,
          fontWeight: 600,
        },
      },
    }),
  },
}

export const MuiListItemIcon = {
  styleOverrides: {
    root: ({ theme }) => ({
      minWidth: 40,
      color: theme.palette.text.secondary,
    }),
  },
}

export const MuiListItemText = {
  styleOverrides: {
    root: {
      margin: 0,
    },

    primary: ({ theme }) => ({
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      color: theme.palette.text.primary,
    }),

    secondary: ({ theme }) => ({
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: theme.palette.text.secondary,
    }),
  },
}

export const MuiListSubheader = {
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor: 'transparent',
      color: theme.palette.text.secondary,
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 2.5,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    }),
  },
}

export const MuiDivider = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderColor: theme.palette.grey[200],
      margin: theme.spacing(1, 0),
    }),

    light: ({ theme }) => ({
      borderColor: theme.palette.grey[100],
    }),
  },
}
/* ===== END: Navigation Components ===== */

/* ===== START: Progress Components ===== */
export const MuiLinearProgress = {
  styleOverrides: {
    root: ({ theme }) => ({
      height: 6,
      borderRadius: theme.spacing(1),
      backgroundColor: theme.palette.grey[200],
      overflow: 'hidden',
    }),

    bar: ({ theme }) => ({
      borderRadius: theme.spacing(1),
      backgroundImage: 'none',
    }),

    colorPrimary: ({ theme }) => ({
      backgroundColor: theme.palette.grey[200],
    }),

    barColorPrimary: ({ theme }) => ({
      backgroundColor: theme.palette.primary.main,
    }),

    colorSecondary: ({ theme }) => ({
      backgroundColor: theme.palette.grey[200],
    }),

    barColorSecondary: ({ theme }) => ({
      backgroundColor: theme.palette.secondary.main,
    }),

    determinate: {
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },

    indeterminate: {
      animation:
        'MuiLinearProgress-indeterminate1 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
    },
  },
}

export const MuiCircularProgress = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.primary.main,
    }),

    circle: {
      strokeLinecap: 'round',
    },

    indeterminate: {
      animation: 'MuiCircularProgress-spin 1.4s linear infinite',
    },
  },

  defaultProps: {
    thickness: 3.6,
  },
}
/* ===== END: Progress Components ===== */

/* ===== START: Skeleton Component ===== */
export const MuiSkeleton = {
  defaultProps: {
    animation: 'wave',
  },
  styleOverrides: {
    root: ({ theme }) => ({
      backgroundColor:
        theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.11)' : 'rgba(255, 255, 255, 0.13)',
      borderRadius: theme.shape.borderRadius,
    }),

    text: ({ theme }) => ({
      borderRadius: theme.spacing(0.5),
      height: '1em',
      marginTop: 0,
      marginBottom: 0,
      transformOrigin: '0 55%',
      transform: 'scale(1, 0.6)',
    }),

    circular: () => ({
      borderRadius: '50%',
    }),

    rectangular: ({ theme }) => ({
      borderRadius: theme.spacing(1),
    }),

    rounded: ({ theme }) => ({
      borderRadius: theme.spacing(1),
    }),
  },
}
/* ===== END: Skeleton Component ===== */

/* ===== START: Table Components ===== */
export const MuiTable = {
  styleOverrides: {
    root: () => ({
      borderCollapse: 'separate',
      borderSpacing: 0,
      fontSize: '0.875rem',
    }),
  },
}

export const MuiTableContainer = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderRadius: theme.spacing(2),
      overflow: 'hidden',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.04)',
      backgroundColor: theme.palette.background.paper,
    }),
  },
}

export const MuiTableHead = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiTableCell-root': {
        backgroundColor: theme.palette.grey[50],
        borderBottom: `1px solid ${theme.palette.grey[200]}`,
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: theme.palette.text.secondary,
        padding: theme.spacing(2, 3),
        whiteSpace: 'nowrap',

        '&:first-of-type': {
          paddingLeft: theme.spacing(3),
        },

        '&:last-of-type': {
          paddingRight: theme.spacing(3),
        },
      },
    }),
  },
}

export const MuiTableBody = {
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiTableRow-root': {
        transition: 'background-color 0.2s ease',

        '&:hover': {
          backgroundColor: theme.palette.grey[50],
        },

        '&:last-child .MuiTableCell-root': {
          borderBottom: 'none',
        },
      },
    }),
  },
}

export const MuiTableRow = {
  styleOverrides: {
    root: ({ theme }) => ({
      '&.Mui-selected': {
        backgroundColor: `${theme.palette.primary.main}08`,

        '&:hover': {
          backgroundColor: `${theme.palette.primary.main}12`,
        },

        '& .MuiTableCell-root': {
          borderBottomColor: `${theme.palette.primary.main}20`,
        },
      },
    }),
  },
}

export const MuiTableCell = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderBottom: `1px solid ${theme.palette.grey[100]}`,
      padding: theme.spacing(2.5, 3),
      fontSize: '0.875rem',
      color: theme.palette.text.primary,
      lineHeight: 1.6,

      '&:first-of-type': {
        paddingLeft: theme.spacing(3),
      },

      '&:last-of-type': {
        paddingRight: theme.spacing(3),
      },
    }),

    head: ({ theme }) => ({
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    }),

    sizeSmall: ({ theme }) => ({
      padding: theme.spacing(1.5, 2),

      '&:first-of-type': {
        paddingLeft: theme.spacing(2.5),
      },

      '&:last-of-type': {
        paddingRight: theme.spacing(2.5),
      },
    }),
  },
}

export const MuiTableSortLabel = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.secondary,
      fontWeight: 600,
      transition: 'color 0.2s ease',

      '&:hover': {
        color: theme.palette.text.primary,
      },

      '&:focus': {
        color: theme.palette.text.primary,
      },

      '&.Mui-active': {
        color: theme.palette.primary.main,

        '& .MuiTableSortLabel-icon': {
          color: theme.palette.primary.main,
          opacity: 1,
        },
      },
    }),

    icon: ({ theme }) => ({
      fontSize: '1rem',
      opacity: 0,
      transition: 'opacity 0.2s ease, transform 0.2s ease',
      marginLeft: theme.spacing(0.5),
      marginRight: 0,
    }),

    iconDirectionDesc: {
      transform: 'rotate(180deg)',
    },

    iconDirectionAsc: {
      transform: 'rotate(0deg)',
    },
  },
}

export const MuiTablePagination = {
  styleOverrides: {
    root: ({ theme }) => ({
      borderTop: `1px solid ${theme.palette.grey[200]}`,
      backgroundColor: theme.palette.grey[50],
      minHeight: 56,

      '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary,
        margin: 0,
      },
    }),

    toolbar: ({ theme }) => ({
      minHeight: 56,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),

      '@media (min-width: 600px)': {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(2),
      },
    }),

    select: ({ theme }) => ({
      fontSize: '0.875rem',
      borderRadius: theme.spacing(1),
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(4),

      '&:hover': {
        backgroundColor: theme.palette.grey[100],
      },

      '&:focus': {
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(1),
      },
    }),

    selectIcon: ({ theme }) => ({
      top: 'calc(50% - 12px)',
      right: theme.spacing(0.5),
      fontSize: '1.25rem',
    }),

    actions: ({ theme }) => ({
      marginLeft: theme.spacing(2),

      '& .MuiIconButton-root': {
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
        fontSize: '1.25rem',

        '&:hover': {
          backgroundColor: theme.palette.grey[100],
        },

        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
          opacity: 0.5,
        },
      },
    }),
  },
}
/* ===== END: Table Components ===== */

/* ===== START: Tabs Components ===== */
export const MuiTabs = {
  styleOverrides: {
    root: ({ theme }) => ({
      minHeight: 48,
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    }),

    indicator: ({ theme }) => ({
      height: 3,
      borderRadius: '3px 3px 0 0',
      backgroundColor: theme.palette.primary.main,
    }),

    flexContainer: {
      gap: 0,
    },

    scrollButtons: ({ theme }) => ({
      color: theme.palette.text.secondary,

      '&:hover': {
        color: theme.palette.text.primary,
      },

      '&.Mui-disabled': {
        opacity: 0.3,
      },
    }),
  },
}

export const MuiTab = {
  styleOverrides: {
    root: ({ theme }) => ({
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '0.875rem',
      minHeight: 48,
      minWidth: 90,
      padding: theme.spacing(1.5, 2),
      marginRight: theme.spacing(0.5),
      color: theme.palette.text.secondary,
      transition: 'all 0.2s ease',

      '&:hover': {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.grey[50],
      },

      '&.Mui-selected': {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },

      '&.Mui-disabled': {
        opacity: 0.5,
      },
    }),

    labelIcon: ({ theme }) => ({
      minHeight: 56,
      paddingTop: theme.spacing(1),

      '& > .MuiTab-iconWrapper': {
        marginBottom: theme.spacing(0.5),
      },
    }),
  },
}
/* ===== END: Tabs Components ===== */

/* ===== START: TextField Components ===== */
export const MuiTextField = {
  defaultProps: {
    variant: 'outlined',
  },
  styleOverrides: {
    root: ({ theme }) => ({
      '& .MuiOutlinedInput-root': {
        borderRadius: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        transition: 'all 0.2s ease-in-out',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',

        '& fieldset': {
          borderColor: theme.palette.grey[300],
          borderWidth: 1,
          transition: 'all 0.2s ease-in-out',
        },

        '&:hover': {
          boxShadow: '0 2px 4px rgba(17, 66, 98, 0.06)',

          '& fieldset': {
            borderColor: theme.palette.grey[400],
          },
        },

        '&.Mui-focused': {
          '& fieldset': {
            borderColor: theme.palette.grey[400],
            borderWidth: 1.5,
          },
        },

        '&.Mui-error fieldset': {
          borderColor: theme.palette.grey[400],
        },

        '&.Mui-disabled': {
          backgroundColor: theme.palette.action.disabledBackground,
          opacity: 0.8,

          '& fieldset': {
            border: 'none',
          },

          '& .MuiInputBase-input': {
            color: theme.palette.text.disabled,
            WebkitTextFillColor: theme.palette.text.disabled,
            cursor: 'not-allowed',
          },
        },
      },

      '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,

        '&.Mui-focused': {
          color: theme.palette.primary.main,
        },

        '&.Mui-error': {
          color: theme.palette.error.main,
        },

        '&.Mui-disabled': {
          color: theme.palette.text.disabled,
          opacity: 0.7,
        },
      },

      '& .MuiInputBase-input': {
        padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
        fontSize: '1rem',

        '&::placeholder': {
          color: theme.palette.text.secondary,
          opacity: 0.5,
        },
      },

      '& .MuiFormHelperText-root': {
        marginTop: theme.spacing(0.5),
        fontSize: '0.8125rem',
      },
    }),
  },
}

export const MuiInputBase = {
  styleOverrides: {
    root: ({ theme }) => ({
      '&.Mui-focused': {
        '& .MuiInputAdornment-root .MuiSvgIcon-root': {
          color: theme.palette.primary.main,
        },
      },
    }),

    input: ({ theme }) => ({
      '&::placeholder': {
        color: theme.palette.text.secondary,
        opacity: 0.5,
      },
      '&::-webkit-input-placeholder': {
        color: theme.palette.text.secondary,
        opacity: 0.5,
      },
      '&::-moz-placeholder': {
        color: theme.palette.text.secondary,
        opacity: 0.5,
      },
      '&:-ms-input-placeholder': {
        color: theme.palette.text.secondary,
        opacity: 0.5,
      },
      '&:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 100px ${theme.palette.background.paper} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
        borderRadius: 'inherit',
      },
    }),
  },
}

export const MuiOutlinedInput = {
  styleOverrides: {
    notchedOutline: {
      borderColor: 'inherit',
    },
  },
}
/* ===== END: TextField Components ===== */

/* ===== START: Other Components ===== */
export const MuiTypography = {
  styleOverrides: {
    gutterBottom: ({ theme }) => ({
      marginBottom: theme.spacing(2),
    }),
  },
}

export const MuiLink = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.primary.main,
      textDecoration: 'none',

      '&:hover': {
        textDecoration: 'underline',
      },
    }),
  },
}

export const MuiTooltip = {
  styleOverrides: {
    tooltip: ({ theme }) => ({
      backgroundColor: theme.palette.grey[800],
      color: theme.palette.common.white,
      fontSize: '0.875rem',
      borderRadius: theme.spacing(1),
      padding: `${theme.spacing(1)} ${theme.spacing(1.5)}`,
    }),
  },
}
/* ===== END: Other Components ===== */

/* ===== START: Material React Table Component ===== */
export const MuiDataGrid = {
  styleOverrides: {
    root: ({ theme }) => ({
      border: 'none',
      borderRadius: theme.spacing(1.5),
      fontSize: '0.875rem',

      '& .MuiDataGrid-main': {
        borderRadius: theme.spacing(1.5),
      },

      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: theme.palette.grey[50],
        borderBottom: `2px solid ${theme.palette.grey[200]}`,
        minHeight: 56,
      },

      '& .MuiDataGrid-columnHeader': {
        '&:focus': {
          outline: 'none',
        },
        '&:focus-within': {
          outline: 'none',
        },
      },

      '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 600,
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: theme.palette.text.secondary,
      },

      '& .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.grey[100]}`,
        '&:focus': {
          outline: 'none',
        },
      },

      '& .MuiDataGrid-row': {
        '&:hover': {
          backgroundColor: theme.palette.grey[50],
        },
        '&.Mui-selected': {
          backgroundColor: `${theme.palette.primary.main}08`,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main}12`,
          },
        },
      },

      '& .MuiDataGrid-footerContainer': {
        borderTop: `2px solid ${theme.palette.grey[200]}`,
        backgroundColor: theme.palette.grey[50],
      },

      '& .MuiTablePagination-root': {
        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
          fontSize: '0.875rem',
          color: theme.palette.text.secondary,
        },
      },
    }),
  },
}

// Global Material React Table configuration
export const MaterialReactTableDefaults = {
  muiTablePaperProps: {
    elevation: 0,
    sx: {
      borderRadius: '12px',
      border: (theme) => `1px solid ${theme.palette.grey[200]}`,
      height: 'calc(100vh - 320px)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
  },
  muiTableContainerProps: {
    sx: {
      flex: 1,
      minHeight: 0,
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: (theme) => theme.palette.grey[100],
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: (theme) => theme.palette.grey[400],
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.grey[500],
        },
      },
    },
  },
  muiTableProps: {
    stickyHeader: true,
    sx: {
      tableLayout: 'auto',
      '& .MuiTableHead-root': {
        position: 'sticky',
        top: 0,
        zIndex: 10,
      },
    },
  },
  muiTableHeadCellProps: {
    sx: (theme) => ({
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.common.white,
      fontWeight: 700,
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      borderBottom: 'none',
      padding: '18px 16px',
      whiteSpace: 'nowrap',
      '& .MuiTableSortLabel-root': {
        display: 'none',
      },
      '& .MuiIconButton-root': {
        display: 'none',
      },
    }),
  },
  muiTableBodyCellProps: {
    sx: {
      fontSize: '0.875rem',
      padding: '14px 12px',
      borderBottom: (theme) => `1px solid ${theme.palette.grey[200]}`,
      color: (theme) => theme.palette.text.primary,
    },
  },
  muiTableBodyRowProps: {
    sx: {
      '&:hover': {
        backgroundColor: (theme) => theme.palette.action.hover,
      },
      '&:last-child td': {
        borderBottom: 'none',
      },
      '& td': {
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      },
    },
  },
  muiTopToolbarProps: {
    sx: {
      display: 'none',
    },
  },
  muiBottomToolbarProps: {
    sx: {
      backgroundColor: (theme) => theme.palette.grey[50],
      boxShadow: 'none',
      borderTop: (theme) => `1px solid ${theme.palette.grey[200]}`,
      padding: '12px 16px',
      minHeight: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomLeftRadius: '12px',
      borderBottomRightRadius: '12px',

      // Pagination controls styling
      '& .MuiTablePagination-root': {
        overflow: 'visible',
        color: (theme) => theme.palette.text.secondary,
        fontSize: '0.875rem',
      },

      // Rows per page label
      '& .MuiTablePagination-selectLabel': {
        margin: 0,
        fontWeight: 500,
        color: (theme) => theme.palette.text.secondary,
        fontSize: '0.875rem',
      },

      // Rows per page select dropdown
      '& .MuiTablePagination-select': {
        fontSize: '0.875rem',
        fontWeight: 600,
        borderRadius: '8px',
        padding: '6px 32px 6px 12px',
        marginLeft: '8px',
        marginRight: '16px',
        backgroundColor: (theme) => theme.palette.background.paper,
        border: (theme) => `1px solid ${theme.palette.grey[300]}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.grey[100],
          borderColor: (theme) => theme.palette.primary.main,
        },
        '&:focus': {
          backgroundColor: (theme) => theme.palette.background.paper,
          borderColor: (theme) => theme.palette.primary.main,
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}20`,
        },
      },

      // Select dropdown icon
      '& .MuiTablePagination-selectIcon': {
        top: 'calc(50% - 10px)',
        right: '8px',
        fontSize: '20px',
        color: (theme) => theme.palette.text.secondary,
      },

      // Page info text
      '& .MuiTablePagination-displayedRows': {
        margin: 0,
        fontSize: '0.875rem',
        fontWeight: 500,
        color: (theme) => theme.palette.text.secondary,
      },

      // Navigation buttons container
      '& .MuiTablePagination-actions': {
        marginLeft: '20px',
        gap: '6px',
        display: 'flex',
        alignItems: 'center',

        // All navigation buttons
        '& .MuiIconButton-root': {
          padding: '8px',
          borderRadius: '8px',
          color: (theme) => theme.palette.common.white,
          backgroundColor: (theme) => theme.palette.primary.main,
          border: 'none',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(17, 66, 98, 0.15)',

          '&:hover:not(.Mui-disabled)': {
            backgroundColor: (theme) => theme.palette.primary.dark,
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(17, 66, 98, 0.25)',
          },

          '&:active:not(.Mui-disabled)': {
            transform: 'translateY(0)',
            boxShadow: '0 1px 2px rgba(17, 66, 98, 0.2)',
          },

          '&.Mui-disabled': {
            opacity: 0.5,
            backgroundColor: (theme) => theme.palette.grey[400],
            color: (theme) => theme.palette.grey[100],
            boxShadow: 'none',
            cursor: 'not-allowed',
          },

          // Icon sizing
          '& svg': {
            fontSize: '20px',
          },
        },
      },

      // Menu items in dropdown
      '& .MuiTablePagination-menuItem': {
        fontSize: '0.875rem',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.primary[50],
        },
        '&.Mui-selected': {
          backgroundColor: (theme) => theme.palette.primary[100],
          fontWeight: 600,
          '&:hover': {
            backgroundColor: (theme) => theme.palette.primary[200],
          },
        },
      },
    },
  },
  enableColumnActions: false,
  enableColumnFilters: false,
  enablePagination: false,
  enableSorting: false,
  enableBottomToolbar: false,
  enableTopToolbar: false,
  enableRowSelection: false,
  enableRowActions: false,
  enableGlobalFilter: false,
  enableFilters: false,
  enableDensityToggle: false,
  enableFullScreenToggle: false,
  enableHiding: false,
  enableStickyHeader: true,
}
/* ===== END: Material React Table Component ===== */

/* ===== START: All Components Export ===== */
export const components = {
  // Alert Components
  MuiAlert,
  MuiAlertTitle,
  MuiSnackbar,
  MuiSnackbarContent,

  // Avatar Components
  MuiAvatar,
  MuiAvatarGroup,

  // Badge Component
  MuiBadge,

  // Button Component
  MuiButton,

  // Card Components
  MuiCard,
  MuiCardContent,
  MuiCardActions,
  MuiCardMedia,

  // Chip Component
  MuiChip,

  // Dialog Components
  MuiDialog,
  MuiDialogTitle,
  MuiDialogContent,
  MuiDialogContentText,
  MuiDialogActions,

  // Navigation Components
  MuiAppBar,
  MuiToolbar,
  MuiDrawer,
  MuiList,
  MuiListItem,
  MuiListItemButton,
  MuiListItemIcon,
  MuiListItemText,
  MuiListSubheader,
  MuiDivider,

  // Progress Components
  MuiLinearProgress,
  MuiCircularProgress,

  // Skeleton Component
  MuiSkeleton,

  // Table Components
  MuiTable,
  MuiTableContainer,
  MuiTableHead,
  MuiTableBody,
  MuiTableRow,
  MuiTableCell,
  MuiTableSortLabel,
  MuiTablePagination,

  // Tabs Components
  MuiTabs,
  MuiTab,

  // TextField Components
  MuiTextField,
  MuiInputBase,
  MuiOutlinedInput,

  // Other Components
  MuiTypography,
  MuiLink,
  MuiTooltip,
}
/* ===== END: All Components Export ===== */
