import {
  TextField,
  InputAdornment,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ClickAwayListener,
} from '@mui/material'
import { ChevronDown, Search } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'
import { PatternFormat } from 'react-number-format'

import countries from '../../../constants/countries'

// Flag display component
const FlagDisplay = ({ countryCode, size = 24 }) => {
  // Always use images for reliable display
  const flagUrl = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`

  return (
    <Box
      component="img"
      src={flagUrl}
      alt={`${countryCode} flag`}
      sx={{
        width: size,
        height: size * 0.75, // Maintain aspect ratio
        objectFit: 'contain',
        borderRadius: '2px',
        display: 'inline-block',
      }}
      onError={(e) => {
        // Fallback to a generic flag icon if image fails
        e.target.style.display = 'none'
      }}
    />
  )
}

const PhoneField = ({
  value = '',
  onChange,
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  defaultCountry = 'NP',
  onCountryChange,
  placeholder = 'Phone',
  ...props
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === defaultCountry) || countries.find((c) => c.code === 'US'),
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (value && typeof value === 'string') {
      const hasCountryCode = value.startsWith('+')
      if (hasCountryCode) {
        const matchedCountry = countries.find((c) => value.startsWith(c.phoneCode))
        if (matchedCountry) {
          setSelectedCountry(matchedCountry)
          setPhoneNumber(value.replace(matchedCountry.phoneCode, '').trim())
        } else {
          setPhoneNumber(value)
        }
      } else {
        setPhoneNumber(value)
      }
    }
  }, [value])

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    setSearchQuery('')
    if (onCountryChange) {
      onCountryChange(country)
    }
    if (onChange) {
      const fullNumber = phoneNumber ? `${country.phoneCode} ${phoneNumber}` : ''
      onChange(fullNumber)
    }
  }

  const handlePhoneChange = (values) => {
    const { formattedValue } = values
    setPhoneNumber(formattedValue)
    if (onChange) {
      const fullNumber = formattedValue ? `${selectedCountry.phoneCode} ${formattedValue}` : ''
      onChange(fullNumber)
    }
  }

  const filteredCountries = countries.filter(
    (country) =>
      country.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.phoneCode.includes(searchQuery),
  )

  return (
    <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
      <PatternFormat
        customInput={TextField}
        format={selectedCountry.format || '### ### ####'}
        mask="_"
        value={phoneNumber}
        onValueChange={handlePhoneChange}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        size={size}
        variant={variant}
        {...props}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ mr: 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: disabled ? 'default' : 'pointer',
                  py: 0.5,
                  borderRight: 1,
                  borderColor: 'divider',
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
              >
                <FlagDisplay countryCode={selectedCountry.code} size={20} />
                <Typography variant="body2" sx={{ fontWeight: 500, mx: 0.5 }}>
                  {selectedCountry.phoneCode}
                </Typography>
                <ChevronDown size={16} />
              </Box>

              {isDropdownOpen && (
                <ClickAwayListener onClickAway={() => setIsDropdownOpen(false)}>
                  <Paper
                    ref={dropdownRef}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      mt: 1,
                      maxHeight: 350,
                      overflow: 'hidden',
                      zIndex: 1300,
                      minWidth: 300,
                    }}
                    elevation={8}
                  >
                    <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search country..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search size={18} />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                    <List sx={{ maxHeight: 280, overflow: 'auto', py: 0 }}>
                      {filteredCountries.map((country) => (
                        <ListItem
                          key={country.code}
                          button
                          onClick={() => handleCountrySelect(country)}
                          sx={{
                            py: 1,
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}
                          >
                            <FlagDisplay countryCode={country.code} size={24} />
                            <ListItemText
                              primary={country.value}
                              secondary={country.phoneCode}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </ClickAwayListener>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  )
}

FlagDisplay.propTypes = {
  countryCode: PropTypes.string.isRequired,
  size: PropTypes.number,
}

PhoneField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium']),
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  defaultCountry: PropTypes.string,
  onCountryChange: PropTypes.func,
  placeholder: PropTypes.string,
}

export default PhoneField
