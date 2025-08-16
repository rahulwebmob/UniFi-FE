import React from 'react'
import { useSelector } from 'react-redux'

import { Box } from '@mui/material'
import { DataGrid, GridToolbar, GridToolbarContainer } from '@mui/x-data-grid'
import {
  jaJP,
  arSD,
  enUS,
  deDE,
  frFR,
  ptBR,
  itIT,
  esES,
} from '@mui/x-data-grid/locales'

const MuiDataGrid = ({
  rows,
  columns,
  loading,
  height,
  noRowsLabel,
  hideFooter,
  pageSizeOptions,
  initialPageSize,
  removeExport,
  dataGridProps,
}) => {
  const { language } = useSelector((state) => state.app)

  const LOCALE_TEXT = {
    ENGLISH: enUS.components.MuiDataGrid.defaultProps.localeText,
    JAPANESE: jaJP.components.MuiDataGrid.defaultProps.localeText,
    ARABIC: arSD.components.MuiDataGrid.defaultProps.localeText,
    GERMAN: deDE.components.MuiDataGrid.defaultProps.localeText,
    FRENCH: frFR.components.MuiDataGrid.defaultProps.localeText,
    PORTUGUESE: ptBR.components.MuiDataGrid.defaultProps.localeText,
    ITALIAN: itIT.components.MuiDataGrid.defaultProps.localeText,
    SPANISH: esES.components.MuiDataGrid.defaultProps.localeText,
  }

  const ToolBar = () => (
    <GridToolbarContainer>
      <GridToolbar
        printOptions={{
          hideFooter: true,
          hideToolbar: true,
          allColumns: true,
          disableToolbarButton: true,
        }}
        csvOptions={{
          disableToolbarButton: removeExport,
        }}
      />
    </GridToolbarContainer>
  )

  const localeText = LOCALE_TEXT?.[language?.value] || LOCALE_TEXT?.ENGLISH
  localeText.noRowsLabel = noRowsLabel

  return (
    <Box
      sx={{
        height,
        width: '100%',
        '& .MuiDataGrid-columnHeader--sorted, button': {
          color: (t) => t.palette.primary.main,
        },
        '& .MuiDataGrid-footerContainer': {
          '& .MuiTablePagination-root': {
            '.MuiTablePagination-actions': {
              '& .MuiButtonBase-root svg': {
                backgroundColor: (t) => t.palette.primary.main,
                fill: (t) => t.palette.common.white,
                borderRadius: '20px',
              },
              '& .MuiButtonBase-root.Mui-disabled svg': {
                backgroundColor: (t) => t.palette.common.white,
                fill: (t) => t.palette.text.disabled,
                borderRadius: '20px',
              },
            },
          },
        },
      }}
    >
      <DataGrid
        sx={{
          '& .MuiDataGrid-footerContainer': {
            '& .MuiTablePagination-root': {
              '& .MuiToolbar-root': {
                alignItems: 'baseline',
              },
            },
          },
        }}
        loading={loading}
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        slots={{
          toolbar: ToolBar,
        }}
        hideFooter={hideFooter}
        localeText={localeText}
        initialState={
          initialPageSize
            ? {
                pagination: {
                  paginationModel: {
                    pageSize: initialPageSize,
                  },
                },
              }
            : {}
        }
        pageSizeOptions={pageSizeOptions}
        {...dataGridProps}
      />
    </Box>
  )
}

export default MuiDataGrid
