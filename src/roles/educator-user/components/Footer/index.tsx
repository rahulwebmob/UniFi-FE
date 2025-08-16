import React from 'react'
import { useTranslation } from 'react-i18next'
import { X, Facebook, Linkedin } from 'lucide-react'

import { Box, Link } from '@mui/material'

const socialLinks = [
  {
    url: 'https://www.facebook.com/people/QuasarMarkets/100094675662530/',
    icon: <Facebook size={18} />,
  },
  {
    url: 'https://www.linkedin.com/company/quasar-markets/',
    icon: <Linkedin size={18} />,
  },
  {
    url: 'https://x.com/QuasarMarkets',
    icon: <X size={18} />,
  },
]

const footerLinks = [
  {
    url: 'https://www.quasarmarkets.com/privacy-policy',
    key: 'FOOTER.PRIVACY_POLICY',
  },
  {
    url: 'https://www.quasarmarkets.com/terms-and-conditions',
    key: 'FOOTER.TERMS_AND_CONDITION',
  },
  {
    url: 'https://www.quasarmarkets.com/refund-and-cancellation',
    key: 'FOOTER.REFUND_ANDCANCELLATION',
  },
  {
    url: 'https://www.quasarmarkets.com/support',
    key: 'FOOTER.SUPPORT',
  },
]

const Footer = () => {
  const { t } = useTranslation('education')

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '10px 24px',
        flexWrap: 'wrap',
      }}
    >
      <Box display="flex" gap="20px" flexWrap="wrap">
        <Box>
          © {new Date().getFullYear()} {t('FOOTER.QUASAR_MARKETS')}
        </Box>
        <Box
          display="flex"
          gap="10px"
          sx={{
            '& .sociallink': {
              border: '1px solid',
              width: '27px',
              textAlign: 'center',
              borderRadius: '5px',
              borderColor: (theme) => theme.palette.primary.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.primary.light,
                color: (theme) => theme.palette.common.white,
              },
            },
          }}
        >
          {socialLinks.map((item) => (
            <Link
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sociallink"
            >
              {item.icon}
            </Link>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          '& .refLinks': {
            textDecoration: 'none',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: (theme) => theme.palette.primary.main,
              textDecoration: 'underline',
            },
          },
        }}
        display="flex"
        gap="10px"
        flexWrap="wrap"
      >
        {footerLinks.map((link) => (
          <Link
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            color="text.secondary"
            variant="body2"
            className="refLinks"
          >
            {t(link.key)}
          </Link>
        ))}
      </Box>
    </Box>
  )
}

export default Footer
