import * as yup from 'yup'
import React, { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Grid, Button, TextField, InputLabel } from '@mui/material'

import { signIn } from '../../../../redux/reducers/user-slice'
import ModalBox from '../../../../shared/components/ui-elements/modal-box'
import { useEditAdminProfileMutation } from '../../../../services/onboarding'

interface ModalRef {
  openModal: () => void
  closeModal: () => void
}

const EditName: React.FC = () => {
  const ref = useRef<ModalRef | null>(null)
  const dispatch = useDispatch()
  const [updateName] = useEditAdminProfileMutation()

  const schemaResolver = yupResolver(
    yup.object().shape({
      firstName: yup.string().trim().required('Please enter first name'),
      lastName: yup.string().trim().required('Please enter last name'),
    }),
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: schemaResolver,
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  })
  const onSubmit = async (values: { firstName: string; lastName: string }) => {
    const response = await updateName({ ...values, update: 'name' })
    if (!response.error && response.data && typeof response.data === 'object' && response.data !== null && !Array.isArray(response.data) && 'token' in response.data) {
      const responseData = response.data as { token: string }
      const newToken = responseData.token
      localStorage.removeItem('token')
      localStorage.setItem('token', newToken)
      dispatch(signIn({ token: newToken }))
      ref.current?.closeModal()
      reset()
    }
  }

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        fullWidth
        onClick={() => {
          ref.current?.openModal()
          reset()
        }}
      >
        Edit Name
      </Button>

      <ModalBox ref={ref} title=" Edit Name" size="sm">
        <form
          className="editname-form"
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        >
          <Grid>
            <InputLabel>FIRST NAME</InputLabel>
            <Controller
              name="firstName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  placeholder="Enter your first name"
                  fullWidth
                  size="small"
                  {...field}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />
              )}
            />
          </Grid>
          <Grid mt={2}>
            <InputLabel>LAST NAME</InputLabel>
            <Controller
              name="lastName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  placeholder="Enter your last name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  {...field}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              )}
            />
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{
              marginTop: '10px',
              width: '100px',
              textTransform: 'none',
            }}
          >
            Update
          </Button>
        </form>
      </ModalBox>
    </>
  )
}

export default EditName
