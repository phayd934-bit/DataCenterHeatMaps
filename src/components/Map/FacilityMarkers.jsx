import { Marker } from 'react-map-gl/mapbox'
import { tierColor } from '../../utils/formatters.js'

export default function FacilityMarkers({ facilities, onClick }) {
  return (
    <>
      {facilities.map((f) => (
        <Marker
          key={f.id}
          longitude={f.lng}
          latitude={f.lat}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            onClick?.(f)
          }}
        >
          <div
            className="rounded-full cursor-pointer border-2 border-white"
            style={{
              width: 12,
              height: 12,
              backgroundColor: tierColor(f.market_tier),
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
            title={f.facility_name}
          />
        </Marker>
      ))}
    </>
  )
}
