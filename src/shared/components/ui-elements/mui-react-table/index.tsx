import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
  type MRT_Localization,
  type MaterialReactTableProps,
  type MRT_TableInstance,
} from 'material-react-table'

import NoDataFound from '../../no-data-found'
import { languageLocalization } from './constant'
import { MaterialReactTableDefaults } from '../../../../theme/foundations/components'

interface MuiReactTableProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: MRT_ColumnDef<TData>[]
  rows: TData[]
  localization?: Partial<MRT_Localization>
  materialReactProps?: Partial<MaterialReactTableProps<TData>>
  returnTableInstance?: false
}

interface MuiReactTablePropsWithInstance<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: MRT_ColumnDef<TData>[]
  rows: TData[]
  localization?: Partial<MRT_Localization>
  materialReactProps?: Partial<MaterialReactTableProps<TData>>
  returnTableInstance: true
}

function MuiReactTable<
  TData extends Record<string, unknown> = Record<string, unknown>,
>(props: MuiReactTablePropsWithInstance<TData>): MRT_TableInstance<TData>
function MuiReactTable<
  TData extends Record<string, unknown> = Record<string, unknown>,
>(props: MuiReactTableProps<TData>): React.JSX.Element
function MuiReactTable<
  TData extends Record<string, unknown> = Record<string, unknown>,
>({
  columns,
  rows,
  localization = {},
  materialReactProps = {},
  returnTableInstance = false,
}: MuiReactTableProps<TData> | MuiReactTablePropsWithInstance<TData>) {
  const { i18n } = useTranslation()

  const tableOptions = {
    columns,
    data: rows,
    localization: {
      ...languageLocalization[
        i18n.language as keyof typeof languageLocalization
      ],
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
