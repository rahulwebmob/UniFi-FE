import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import React, { useRef, useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

// import AutocompleteComponent from '@Components/Modules/TradingView/Common/AutocompleteComponent'
import {
  Box,
  Chip,
  Button,
  useTheme,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
} from '@mui/material'

import { useGetCategoryListQuery } from '../../../../../../services/admin'
import ModalBox from '../../../../../../shared/components/ui-elements/modal-box'

const AddCategory = () => {
  const theme = useTheme()
  const {
    control,
    categories,
    setCategories,
    formState: { errors },
  } = useFormContext()
  const categoryRef = useRef(null)

  const { t } = useTranslation('education')
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data, isLoading } = useGetCategoryListQuery()

  useEffect(() => {
    if (data?.data?.length && !isLoading) {
      setCategories((prev) => [...new Set([...data.data.slice(0, 5), ...prev])])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading])

  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory])
  }

  const handleAdd = () => {
    handleAddCategory(selectedCategory)
    setSelectedCategory('')
    categoryRef.current.closeModal()
  }

  return (
    <>
      <Controller
        name="category"
        control={control}
        render={({ field: { onChange, value } }) => (
          <FormControl fullWidth>
            <Box display="flex" gap={1} flexWrap="wrap">
              {categories?.map((name) => (
                <Chip
                  key={name}
                  label={name}
                  size="small"
                  variant={value?.includes(name) ? 'filled' : 'outlined'}
                  onClick={() => {
                    if (value?.includes(name)) {
                      onChange(value.filter((v) => v !== name))
                    } else {
                      onChange([...value, name])
                    }
                  }}
                  sx={{
                    backgroundColor: value?.includes(name)
                      ? theme.palette.primary.main
                      : 'transparent',
                    color: value?.includes(name)
                      ? 'white'
                      : theme.palette.text.primary,
                    borderColor: value?.includes(name)
                      ? theme.palette.primary.main
                      : theme.palette.grey[300],
                    '&:hover': {
                      backgroundColor: value?.includes(name)
                        ? theme.palette.primary.dark
                        : theme.palette.grey[100],
                    },
                  }}
                />
              ))}
              <Button
                startIcon={<Plus size={16} />}
                variant="outlined"
                size="small"
                onClick={() => categoryRef.current.openModal()}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  textTransform: 'none',
                  borderRadius: '16px',
                  height: '32px',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '10',
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                {t('EDUCATOR.BASIC_DETAILS.ADD_EXPERTISE')}
              </Button>
            </Box>
            {errors?.category && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, display: 'block' }}
              >
                {errors?.category?.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
      <ModalBox ref={categoryRef} size="xs">
        <Box>
          <Typography variant="h6" marginBottom={2}>
            {t('EDUCATOR.CATEGORY_MODAL.ADD_NEW_CATEGORY')}
          </Typography>
          <Autocomplete
            sx={{
              minWidth: 250,
            }}
            size="small"
            disablePortal
            options={
              data?.data?.filter((value) => !categories.includes(value)) || []
            }
            value={selectedCategory}
            getOptionLabel={(option) => option || ''}
            onChange={(__, newValue) => {
              setSelectedCategory(newValue)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('EDUCATOR.CATEGORY_MODAL.CATEGORY_LABEL')}
              />
            )}
          />
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button
              onClick={() => categoryRef.current.closeModal()}
              color="secondary"
              sx={{ marginRight: 1 }}
            >
              {t('EDUCATOR.COMMON_KEYS.CANCEL')}
            </Button>
            <Button
              onClick={handleAdd}
              color="primary"
              variant="contained"
              disabled={!selectedCategory?.trim()}
            >
              {t('EDUCATOR.COMMON_KEYS.ADD')}
            </Button>
          </Box>
        </Box>
      </ModalBox>
    </>
  )
}

export default AddCategory
