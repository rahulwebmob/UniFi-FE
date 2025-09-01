import { Box, Chip, Button, TextField, Typography, FormControl, Autocomplete } from '@mui/material'
import { Plus } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

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

  const [selectedCategory, setSelectedCategory] = useState('')

  const { data, isLoading } = useGetCategoryListQuery()

  useEffect(() => {
    if (data?.data?.length && !isLoading) {
      setCategories((prev) => [...new Set([...data.data.slice(0, 5), ...prev])])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
                    if (value?.includes(name)) {
                      onChange(value.filter((v) => v !== name))
                    } else {
                      onChange([...value, name])
                    }
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
                {errors.category.message}
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
