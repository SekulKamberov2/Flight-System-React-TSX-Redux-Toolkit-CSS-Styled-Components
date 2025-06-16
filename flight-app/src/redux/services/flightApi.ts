import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Airport {
  icao?: string;
  iata?: string;
  name: string;
  shortName?: string;
  municipalityName?: string;
  location?: {
    lat: number;
    lon: number;
  };
  countryCode?: string;
  timeZone?: string;
}

interface FlightTime {
  utc: string;
  local: string;
}

interface Departure {
  scheduledTime: FlightTime;
  revisedTime?: FlightTime;
  runwayTime?: FlightTime;
  runway?: string;
  terminal?: string;
  gate?: string;
  quality: string[];
}

interface Arrival {
  airport: Airport;
  scheduledTime?: FlightTime;
  revisedTime?: FlightTime;
  runwayTime?: FlightTime;
  quality: string[];
}

interface Aircraft {
  reg?: string;
  modeS?: string;
  model: string;
}

interface Airline {
  name: string;
  iata?: string;
  icao?: string;
}

export interface FlightStatusResponse {
  departure: Departure;
  arrival: Arrival;
  number: string;
  callSign?: string;
  status: string;
  codeshareStatus?: string;
  isCargo?: boolean;
  aircraft?: Aircraft;
  airline: Airline;
}

export interface AirportFlightsResponse {
  departures?: FlightStatusResponse[];
  arrivals?: FlightStatusResponse[];
}

export const flightApi = createApi({
  reducerPath: 'flightApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://aerodatabox.p.rapidapi.com',
    prepareHeaders: (headers) => {
      headers.set('x-rapidapi-key', 'ca9d290a97mshdd0b910e41f62e8p10de47jsn7e9bdd761c77');
      headers.set('x-rapidapi-host', 'aerodatabox.p.rapidapi.com');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getFlightStatus: builder.query<FlightStatusResponse[], { 
      flightNumber: string;
      withAircraftImage?: boolean;
      withLocation?: boolean;
    }>({
      query: ({ flightNumber, withAircraftImage = false, withLocation = false }) => ({
        url: `/flights/number/${flightNumber}`,
        params: {
          withAircraftImage,
          withLocation,
        },
      }),
      transformResponse: (response: FlightStatusResponse | FlightStatusResponse[]) => {
        return Array.isArray(response) ? response : [response];
      }
    }),
    getFlightStatusByDate: builder.query<FlightStatusResponse[], {
      flightNumber: string;
      date: string;
    }>({
      query: ({ flightNumber, date }) => ({
        url: `/flights/number/${flightNumber}/${date}`,
        params: {
          withAircraftImage: false,
          withLocation: false,
        },
      }),
      transformResponse: (response: FlightStatusResponse | FlightStatusResponse[]) => {
        return Array.isArray(response) ? response : [response];
      }
    }),
    getAirportDepartures: builder.query<AirportFlightsResponse, {
      airportCode: string;
      fromTime: string;
      toTime: string;
    }>({
      query: ({ airportCode, fromTime, toTime }) => ({
        url: `/flights/airports/icao/${airportCode}/${fromTime}/${toTime}`,
        params: {
          direction: 'Departure',
          withAircraftImage: false,
          withLocation: false,
        },
      }),
    }),
    getAirportArrivals: builder.query<AirportFlightsResponse, {
      airportCode: string;
      fromTime: string;
      toTime: string;
    }>({
      query: ({ airportCode, fromTime, toTime }) => ({
        url: `/flights/airports/icao/${airportCode}/${fromTime}/${toTime}`,
        params: {
          direction: 'Arrival',
          withAircraftImage: false,
          withLocation: false,
        },
      }),
    }),
  }),
});

export const {
  useGetFlightStatusQuery,
  useLazyGetFlightStatusQuery,
  useGetFlightStatusByDateQuery,
  useLazyGetFlightStatusByDateQuery,
  useGetAirportDeparturesQuery,
  useLazyGetAirportDeparturesQuery,
  useGetAirportArrivalsQuery,
  useLazyGetAirportArrivalsQuery,
} = flightApi;