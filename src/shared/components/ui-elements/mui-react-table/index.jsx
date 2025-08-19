import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
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
}) => {
  const { i18n } = useTranslation()

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
    // Merge sx props properly
    muiTablePaperProps: {
      ...MaterialReactTableDefaults.muiTablePaperProps,
      ...materialReactProps?.muiTablePaperProps,
    },
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

export default MuiReactTable
