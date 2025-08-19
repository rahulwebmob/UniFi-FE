import { Box, Typography, Chip, useTheme, Button } from '@mui/material'
import { FileText } from 'lucide-react'
import PropTypes from 'prop-types'
import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { successAlert } from '../../../../../redux/reducers/app-slice'
import {
  useGetEducationPaymentsQuery,
  useLazyGetEducationInvoiceQuery,
} from '../../../../../services/education'
import ApiMiddleware from '../../../../../shared/components/api-middleware'
import MuiReactTable from '../../../../../shared/components/ui-elements/mui-react-table'
import { handleGeneratePdf } from '../../../../admin-user/components/common'

// Extracted Cell components
const ContentCell = ({ row }) => {
  const { original: item } = row
  let thumbnail = null
  let title = ''

  if (item.moduleType === 'course' && item.courseId) {
    const {
      thumbnail: courseThumbnail,
      thumbNail: courseThumbNail,
      title: courseTitle,
    } = item.courseId
    thumbnail = courseThumbnail || courseThumbNail || null
    title = courseTitle
  } else if (item.moduleType === 'webinar' && item.webinarId) {
    const {
      thumbnail: webinarThumbnail,
      thumbNail: webinarThumbNail,
      title: webinarTitle,
    } = item.webinarId
    thumbnail = webinarThumbnail || webinarThumbNail || null
    title = webinarTitle
  } else {
    title = `${item.moduleType} Payment`
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{
          width: 60,
          height: 40,
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: (theme) => theme.palette.grey[100],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt="thumbnail"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary">
            {item.moduleType}
          </Typography>
        )}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          fontWeight="medium"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  )
}

ContentCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      moduleType: PropTypes.string.isRequired,
      courseId: PropTypes.shape({
        thumbnail: PropTypes.string,
        thumbNail: PropTypes.string,
        title: PropTypes.string,
      }),
      webinarId: PropTypes.shape({
        thumbnail: PropTypes.string,
        thumbNail: PropTypes.string,
        title: PropTypes.string,
      }),
    }).isRequired,
  }).isRequired,
}

const ModuleTypeCell = ({ row }) => {
  const { original: item } = row
  return (
    <Chip
      label={item.moduleType}
      size="small"
      color="primary"
      variant="outlined"
      sx={{ textTransform: 'capitalize' }}
    />
  )
}

ModuleTypeCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      moduleType: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

const AmountCell = ({ row }) => {
  const { original: item } = row
  return (
    <Typography variant="body2" fontWeight="medium">
      ${item.amount} {item.currency || 'USD'}
    </Typography>
  )
}

AmountCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      currency: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

const DateCell = ({ row }) => {
  const { original: item } = row
  return (
    <Typography variant="body2">
      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
    </Typography>
  )
}

DateCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      createdAt: PropTypes.string,
    }).isRequired,
  }).isRequired,
}

const InvoiceCell = ({ row, handleGetEducationInvoice, t }) => {
  const { original: item } = row
  return (
    <Button
      variant="text"
      color="primary"
      startIcon={<FileText size={16} />}
      onClick={() => handleGetEducationInvoice(item._id)}
    >
      {t('application:PROFILE.SUBSCRIPTION.INVOICE')}
    </Button>
  )
}

InvoiceCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleGetEducationInvoice: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

// Wrapper function to avoid nested components
const createInvoiceCellWrapper = (handleGetEducationInvoice, t) => {
  const InvoiceCellWrapper = (props) => (
    <InvoiceCell row={props.row} handleGetEducationInvoice={handleGetEducationInvoice} t={t} />
  )
  InvoiceCellWrapper.displayName = 'InvoiceCellWrapper'
  InvoiceCellWrapper.propTypes = {
    row: PropTypes.object.isRequired,
  }
  return InvoiceCellWrapper
}

const EducationPayments = () => {
  const theme = useTheme()
  const { t } = useTranslation('application')
  const dispatch = useDispatch()

  const [getEducationInvoice] = useLazyGetEducationInvoiceQuery()
  const { data, isLoading, error } = useGetEducationPaymentsQuery({})

  const handleSuccessAlert = useCallback(
    () =>
      dispatch(
        successAlert({
          message: t('application:PROFILE.SUBSCRIPTION.MESSAGE_SUCCESS_INVOICE'),
        }),
      ),
    [dispatch, t],
  )

  const handleGetEducationInvoice = useCallback(
    (transactionId) => {
      void handleGeneratePdf(
        transactionId,
        (params) =>
          getEducationInvoice({
            invoiceId: params.transactionId,
          }),
        handleSuccessAlert,
      )
    },
    [getEducationInvoice, handleSuccessAlert],
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'content',
        header: 'Content',
        Cell: ContentCell,
      },
      {
        accessorKey: 'moduleType',
        header: 'Content Type',
        Cell: ModuleTypeCell,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        Cell: AmountCell,
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        Cell: DateCell,
      },
      {
        accessorKey: 'actions',
        header: 'Invoice',
        enableSorting: false,
        Cell: createInvoiceCellWrapper(handleGetEducationInvoice, t),
      },
    ],
    [t, handleGetEducationInvoice],
  )

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2.5,
          color: theme.palette.text.primary,
        }}
      >
        {t('application:PROFILE.EDUCATION_PAYMENTS')}
      </Typography>

      <Box>
        <ApiMiddleware isLoading={isLoading} error={error} isData={!!data?.length}>
          <MuiReactTable
            columns={columns}
            rows={data || []}
            materialReactProps={{
              enableTopToolbar: false,
              enableBottomToolbar: false,
              enablePagination: false,
              enableSorting: true,
              enableColumnActions: false,
              enableColumnFilters: false,
              enableDensityToggle: false,
              enableFullScreenToggle: false,
              enableHiding: false,
            }}
          />
        </ApiMiddleware>
      </Box>
    </>
  )
}

export default EducationPayments
