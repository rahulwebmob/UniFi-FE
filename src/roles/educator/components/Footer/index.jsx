import { Box, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'

// Social media SVG icons
import FacebookIcon from '../../../../assets/social-icons/facebook.svg'
import LinkedinIcon from '../../../../assets/social-icons/linkedin.svg'
import XIcon from '../../../../assets/social-icons/x-twitter.svg'

const socialLinks = [
  {
    url: '#',
    icon: FacebookIcon,
    name: 'Facebook',
  },
  {
    url: '#',
    icon: LinkedinIcon,
    name: 'LinkedIn',
  },
  {
    url: '#',
    icon: XIcon,
    name: 'X',
  },
]

const footerLinks = [
  {
    url: '#',
    key: 'FOOTER.PRIVACY_POLICY',
  },
  {
    url: '#',
    key: 'FOOTER.TERMS_AND_CONDITION',
  },
  {
    url: '#',
    key: 'FOOTER.REFUND_ANDCANCELLATION',
  },
  {
    url: '#',
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
        <Box>© {new Date().getFullYear()} UniCitizens</Box>
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
            <Link key={item.name} href={item.url} target="_blank" rel="noopener noreferrer">
              <img
                src={item.icon}
                alt={item.name}
                width="18"
                height="18"
                style={{ display: 'block' }}
              />
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
          >
            {t(link.key)}
          </Link>
        ))}
      </Box>
    </Box>
  )
}

Footer.propTypes = {}

export default Footer
