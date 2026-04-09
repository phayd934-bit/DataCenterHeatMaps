import { createContext, useContext } from 'react'
import { useFacilities } from '../hooks/useFacilities.js'
import { useFilters } from '../hooks/useFilters.js'

const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const facilities = useFacilities()
  const filterState = useFilters(facilities)

  return (
    <FilterContext.Provider value={{ facilities, ...filterState }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilterContext() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilterContext must be used within FilterProvider')
  return ctx
}
