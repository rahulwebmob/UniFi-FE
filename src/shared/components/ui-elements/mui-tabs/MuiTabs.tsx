import type { ReactNode } from 'react';

import React from 'react'

import { Box, Tab, Tabs } from '@mui/material'

interface TabPanelProps {
  children?: ReactNode
  value: number
  alignment: string
  index: number
  [key: string]: unknown
}

const TabPanel = ({ children = null, value, alignment, index, ...other }: TabPanelProps) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${alignment}-tabpanel-${index}`}
      aria-labelledby={`${alignment}-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            mt: 1,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )


const a11yProps = (index, alignment) => ({
  id: `${alignment}-tab-${index}`,
  'aria-controls': `${alignment}-tabpanel-${index}`,
  height: '100%',
})

interface MuiTabsProps {
  listItems: Record<string, React.ComponentType>
  alignment: 'vertical' | 'horizontal'
}

const MuiTabs = ({ listItems, alignment }: MuiTabsProps) => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <Tabs
        orientation="horizontal"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Horizontal tabs example"
        sx={{
          borderColor: 'transparent',
          '& div[role="tabpanel"]': {
            height: '100%',
          },
        }}
      >
        {Object.keys(listItems).map((label, index) => (
          <Tab
            height="100%"
            label={label}
            {...a11yProps(index, alignment)}
            key={label}
          />
        ))}
      </Tabs>
      {Object.keys(listItems).map((label, index) => {
        const Component = listItems[label]
        return (
          <TabPanel
            value={value}
            index={index}
            key={label}
            alignment={alignment}
          >
            <Component />
          </TabPanel>
        )
      })}
    </>
  )
}

export default MuiTabs

