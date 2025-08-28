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
import { Plus } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

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

  const [selectedCategory, setSelectedCategory] = useState('')

  const { data, isLoading } = useGetCategoryListQuery()

  useEffect(() => {
    if (data?.data?.length && !isLoading) {
      setCategories((prev) => [...new Set([...data.data.slice(0, 5), ...prev])])
    }
  }, [data, isLoading, setCategories])

  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory])
  }

  const handleAdd = () => {
    if (selectedCategory.trim()) {
      handleAddCategory(selectedCategory)
      setSelectedCategory('')
      categoryRef.current?.closeModal()
    }
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
                    const currentValue = value || []
                    if (currentValue.includes(name)) {
                      onChange(currentValue.filter((v) => v !== name))
                    } else {
                      onChange([...currentValue, name])
                    }
                  }}
                  sx={{
                    backgroundColor: value?.includes(name)
                      ? theme.palette.primary.main
                      : 'transparent',
                    color: value?.includes(name) ? 'white' : theme.palette.text.primary,
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
                onClick={() => categoryRef.current?.openModal()}
              >
                Add Expertise
              </Button>
            </Box>
            {errors?.category && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                {typeof errors.category === 'string' ? errors.category : errors.category.message}
              </Typography>
            )}
          </FormControl>
        )}
      />
      <ModalBox ref={categoryRef} size="xs">
        <Box>
          <Typography variant="h6" marginBottom={2}>
            Add New Category
          </Typography>
          <Autocomplete
            sx={{
              minWidth: 250,
            }}
            size="small"
            disablePortal
            options={data?.data?.filter((value) => !categories.includes(value)) || []}
            value={selectedCategory}
            getOptionLabel={(option) => option || ''}
            onChange={(__, newValue) => {
              setSelectedCategory(newValue || '')
            }}
            renderInput={(params) => <TextField {...params} label="Category" />}
          />
          <Box display="flex" justifyContent="flex-end" marginTop={2}>
            <Button
              onClick={() => categoryRef.current.closeModal()}
              color="secondary"
              sx={{ marginRight: 1 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              color="primary"
              variant="contained"
              disabled={!selectedCategory?.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>
      </ModalBox>
    </>
  )
}

export default AddCategory
