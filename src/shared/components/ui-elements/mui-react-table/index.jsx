import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { MaterialReactTableDefaults } from '../../../../theme/foundations/components'
import NoDataFound from '../../no-data-found'

import { languageLocalization } from './constant'

const MuiReactTable = ({
  columns,
  rows,
  localization = {},
  materialReactProps = {},
  returnTableInstance = false,
  height = 'auto', // New prop with default value
}) => {
  const { i18n } = useTranslation()

  // Override default height if custom height is provided
  const tablePaperProps = {
    ...MaterialReactTableDefaults.muiTablePaperProps,
    ...materialReactProps?.muiTablePaperProps,
    sx: {
      ...MaterialReactTableDefaults.muiTablePaperProps?.sx,
      height, // Use the height prop
      display: height === 'auto' ? 'block' : 'flex',
      ...materialReactProps?.muiTablePaperProps?.sx,
    },
  }

  const tableContainerProps = {
    ...MaterialReactTableDefaults.muiTableContainerProps,
    ...materialReactProps?.muiTableContainerProps,
    sx: {
      ...MaterialReactTableDefaults.muiTableContainerProps?.sx,
      flex: height === 'auto' ? 'none' : 1,
      maxHeight: height === 'auto' ? 'none' : undefined,
      ...materialReactProps?.muiTableContainerProps?.sx,
    },
  }

  const tableOptions = {
    columns,
    data: rows,
    localization: {
      ...languageLocalization[i18n.language],
      ...localization,
    },
    ...MaterialReactTableDefaults,
    // Custom empty state with NoDataFound component (can be overridden)
    renderEmptyRowsFallback: () => <NoDataFound isTable />,
    ...materialReactProps,
    // Merge props with height-aware overrides
    muiTablePaperProps: tablePaperProps,
    muiTableContainerProps: tableContainerProps,
    muiTableHeadCellProps: {
      ...MaterialReactTableDefaults.muiTableHeadCellProps,
      ...materialReactProps?.muiTableHeadCellProps,
    },
    muiTableBodyCellProps: {
      ...MaterialReactTableDefaults.muiTableBodyCellProps,
      ...materialReactProps?.muiTableBodyCellProps,
    },
    muiTopToolbarProps: {
      ...MaterialReactTableDefaults.muiTopToolbarProps,
      ...materialReactProps?.muiTopToolbarProps,
    },
    muiBottomToolbarProps: {
      ...MaterialReactTableDefaults.muiBottomToolbarProps,
      ...materialReactProps?.muiBottomToolbarProps,
    },
  }

  const getTableInstance = useMaterialReactTable(tableOptions)

  if (returnTableInstance) {
    return getTableInstance
  }

  return <MaterialReactTable table={getTableInstance} />
}

MuiReactTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  localization: PropTypes.object,
  materialReactProps: PropTypes.object,
  returnTableInstance: PropTypes.bool,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default MuiReactTable
