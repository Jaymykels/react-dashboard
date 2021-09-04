import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

interface MapChartInterface {
    markers: { coordinates: number[] }[]
}

const MapChart = ({markers}: MapChartInterface) => {
  return (
    <ComposableMap
    >
      <Geographies geography={geoUrl}>
        {({ geographies }: {geographies: any}) =>
          geographies
            .map((geo: any) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#EAEAEC"
                stroke="#D6D6DA"
              />
            ))
        }
      </Geographies>
      {markers.map(({ coordinates }, index) => (
        <Marker key={index} coordinates={coordinates as [number, number]}>
          <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
        </Marker>
      ))}
    </ComposableMap>
  );
};

export default MapChart;
