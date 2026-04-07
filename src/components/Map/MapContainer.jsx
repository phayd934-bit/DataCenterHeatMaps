import { useCallback } from 'react'
import { MapContainer as LeafletMap, TileLayer, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useFilterContext } from '../../context/FilterContext.jsx'
import FacilityMarkers from './FacilityMarkers.jsx'
import MapLegend from './MapLegend.jsx'

const INITIAL_CENTER = [45, -40]
const INITIAL_ZOOM = 3

export default function MapContainer({ selectedFacilityId, onSelectFacility, onSelectRegion }) {
  const { filtered } = useFilterContext()

  const handleMarkerClick = useCallback((facility) => {
    onSelectFacility?.(facility)
  }, [onSelectFacility])

  return (
    <LeafletMap
      center={INITIAL_CENTER}
      zoom={INITIAL_ZOOM}
      zoomControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="topright" />
      <FacilityMarkers facilities={filtered} selectedId={selectedFacilityId} onClick={handleMarkerClick} />
      <MapLegend />
    </LeafletMap>
  )
}
