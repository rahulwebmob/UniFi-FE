import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import React, { useRef, useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

// import AutocompleteComponent from '@Components/Modules/TradingView/Common/AutocompleteComponent'
import { 
  Box,
  Chip,
  Button,
  TextField,
  Typography,
  FormControl,
  Autocomplete
} from '@mui/material'

import { useGetCategoryListQuery } from '../../../../../../services/admin'
import ModalBox from '../../../../../../shared/components/ui-elements/modal-box'

const AddCategory = () => {
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
            <Typography variant="body1" mb={0.5}>
              {t('EDUCATOR.BASIC_DETAILS.COURSE_CATEGORY')}
              <Typography variant="body1" color="error.main" component="span">
                *
              </Typography>
            </Typography>
            <Box display="flex" gap="8px" flexWrap="wrap">
              {categories?.map((name) => (
                <Chip
                  key={name}
                  label={name}
                  color="primary"
                  size="small"
                  className={value?.includes(name) ? 'active' : ''}
                  variant="outlined"
                  onClick={() => {
                    if (value?.includes(name)) {
                      onChange(value.filter((v) => v !== name))
                    } else {
                      onChange([...value, name])
                    }
                  }}
                />
              ))}
              <Chip
                icon={<Plus size={16} />}
                label={t('EDUCATOR.BASIC_DETAILS.ADD_EXPERTISE')}
                color="primary"
                variant="body1"
                size="small"
                onClick={() => categoryRef.current.openModal()}
                sx={{
                  borderColor: (theme) => theme.palette.primary.main,
                  color: (theme) => theme.palette.primary.main,
                }}
              />
            </Box>
            {errors?.category && (
              <Typography color="error">{errors?.category?.message}</Typography>
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
