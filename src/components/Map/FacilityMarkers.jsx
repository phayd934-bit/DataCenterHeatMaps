import { CircleMarker, Tooltip } from 'react-leaflet'
import { getFacilityColor, statusLabel } from '../../utils/formatters.js'

export default function FacilityMarkers({ facilities, selectedId, onClick }) {
  const mapped = facilities.filter((f) => f.lat != null && f.lng != null)
  return (
    <>
      {mapped.map((f) => {
        const isSelected = f.id === selectedId
        return (
        <CircleMarker
          key={f.id}
          center={[f.lat, f.lng]}
          radius={isSelected ? 12 : 7}
          pathOptions={{
            fillColor: getFacilityColor(f.status, f.market_tier),
            fillOpacity: isSelected ? 1 : 0.85,
            color: '#fff',
            weight: isSelected ? 3 : 2,
          }}
          eventHandlers={{
            click: () => onClick?.(f),
          }}
        >
          <Tooltip direction="top" offset={[0, -8]}>
            <span className="text-xs font-medium">{f.facility_name}</span>
            <br />
            <span className="text-[10px] text-gray-500">{f.company}</span>
            {f.status !== 'operational' && (
              <>
                <br />
                <span className="text-[10px] font-medium" style={{ color: getFacilityColor(f.status, f.market_tier) }}>
                  {statusLabel(f.status)}
                </span>
              </>
            )}
          </Tooltip>
        </CircleMarker>
        )
      })}
    </>
  )
}
