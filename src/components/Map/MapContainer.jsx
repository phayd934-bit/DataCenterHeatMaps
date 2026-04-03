import { useState, useCallback } from 'react'
import Map, { NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useFilterContext } from '../../context/FilterContext.jsx'
import FacilityMarkers from './FacilityMarkers.jsx'
import MapLegend from './MapLegend.jsx'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

const INITIAL_VIEW = {
  longitude: -40,
  latitude: 45,
  zoom: 2.5,
}

export default function MapContainer({ onSelectFacility, onSelectRegion }) {
  const { filtered } = useFilterContext()
  const [viewState, setViewState] = useState(INITIAL_VIEW)

  const handleMarkerClick = useCallback((facility) => {
    onSelectFacility?.(facility)
  }, [onSelectFacility])

  return (
    <Map
      {...viewState}
      onMove={(e) => setViewState(e.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/light-v11"
      style={{ width: '100%', height: '100%' }}
    >
      <NavigationControl position="top-right" />
      <FacilityMarkers facilities={filtered} onClick={handleMarkerClick} />
      <MapLegend />
    </Map>
  )
}
