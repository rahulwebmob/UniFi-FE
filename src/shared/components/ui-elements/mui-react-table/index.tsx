import React from 'react'
import { useTranslation } from 'react-i18next'
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'

import { languageLocalization } from './constant'

const MuiReactTable = ({
  columns,
  rows,
  localization,
  materialReactProps,
  returnTableInstance,
}) => {
  const { i18n } = useTranslation()

  const tableOptions = {
    columns,
    data: rows,
    localization: {
      ...languageLocalization[i18n.language],
      ...localization,
    },
    ...materialReactProps,
  }

  const getTableInstance = useMaterialReactTable(tableOptions)

  if (returnTableInstance) {
    return getTableInstance
  }

  return <MaterialReactTable table={getTableInstance} />
}

export default MuiReactTable
