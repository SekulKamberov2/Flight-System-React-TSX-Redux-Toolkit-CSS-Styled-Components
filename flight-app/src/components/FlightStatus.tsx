import React, { useState } from 'react';
import { 
  useGetFlightStatusQuery,
  useGetFlightStatusByDateQuery,
  useGetAirportDeparturesQuery,
  useGetAirportArrivalsQuery,
  useLazyGetFlightStatusQuery 
} from '../redux/services/flightApi';
import styled from 'styled-components';
 
interface RoundedButtonProps {
  backgroundColor?: string;
  color?: string;
  hoverBackgroundColor?: string;
  width?: string;
}

const RoundedButton = styled.button<RoundedButtonProps>`
  display: flex; 
  justify-content: center;
  align-items: center;
  padding: 5px 8px;
  background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
  color: ${({ color }) => color || 'black'};
  border: 2px solid black;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 650;
  margin-left: 3px;
  width: ${({ width }) => width || 'auto'};  
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ hoverBackgroundColor }) => hoverBackgroundColor || 'transparent'};
    border-color: black; 
  }
`;
 
const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #444;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 24px;
`;

const FlightCard = styled.div`
  background: #f9f9f9;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px; 
`;

const FlightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const FlightInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const AirportInfo = styled.div`
  flex: 1;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  background-color: ${props => 
    props.status === 'OnTime' ? '#52c41a' : 
    props.status === 'Delayed' ? '#faad14' : '#f5222d'};
  color: white;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const StyledInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
`;
  
const LoadingSpinner = styled.div`
  margin-top: 16px;
  text-align: center;
  font-size: 16px;
  color: #888;
`;

const ListContainer = styled.div`
  margin-top: 16px;
  max-height: 400px;
  overflow-y: auto; 
`;

const ErrorMessage = styled.div`
  color: #f5222d;
  margin: 16px 0;
`;

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formatDate(date)}T${hours}:${minutes}`;
};

const FlightStatus = () => {
  const [flightNumber, setFlightNumber] = useState('DL47');
  const [date, setDate] = useState(formatDate(new Date()));
  const [airportCode, setAirportCode] = useState('KJFK');
  
  const now = new Date();
  const [timeRange, setTimeRange] = useState({
    from: formatDateTime(new Date(now.setHours(0, 0, 0, 0))),
    to: formatDateTime(new Date(now.setHours(23, 59, 59, 999))),
  });

  const { 
    data: currentStatus, 
    isLoading: currentLoading, 
    error: currentError 
  } = useGetFlightStatusQuery({ 
    flightNumber,
    withAircraftImage: false,
    withLocation: false
  });

  const { 
    data: historicalStatus, 
    isLoading: historicalLoading, 
    error: historicalError 
  } = useGetFlightStatusByDateQuery({ 
    flightNumber, 
    date 
  });

  const { 
    data: departures, 
    isLoading: departuresLoading, 
    error: departuresError 
  } = useGetAirportDeparturesQuery({
    airportCode,
    fromTime: timeRange.from,
    toTime: timeRange.to
  });

  const { 
    data: arrivals, 
    isLoading: arrivalsLoading, 
    error: arrivalsError 
  } = useGetAirportArrivalsQuery({
    airportCode,
    fromTime: timeRange.from,
    toTime: timeRange.to
  });

  const [triggerFlightLookup, { 
    data: manualLookup, 
    isLoading: manualLoading, 
    error: manualError 
  }] = useLazyGetFlightStatusQuery();

  const handleSearch = () => {
    triggerFlightLookup({ 
      flightNumber,
      withAircraftImage: false,
      withLocation: false
    });
  };

  const handleDateChange = (dateString: string) => {
    if (dateString) {
      setDate(dateString);
    }
  };

  const renderFlightStatus = (flight: any) => {
    const getTimeString = (timeObj?: any) => {
      if (!timeObj?.local) return null;
      return timeObj.local.includes('T') 
        ? timeObj.local.split('T')[1] 
        : timeObj.local;
    };

    const departureTime = getTimeString(flight.departure.scheduledTime) ?? 'N/A';
    const arrivalTime = getTimeString(flight.arrival.scheduledTime) ?? 'N/A';
    const arrivalAirport = flight.arrival.airport?.name ?? 'Unknown Airport';

    return ( 
      <FlightCard key={`${flight.number}-${departureTime}`}>
        <FlightHeader>
          <strong>
            {flight.airline?.name ?? 'Unknown Airline'} {flight.number}
          </strong>
          <StatusBadge status={flight.status}>
            {flight.status}
          </StatusBadge>
        </FlightHeader>
        
        <FlightInfo>
          <AirportInfo>
            <div style={{ color: '#666' }}>Departure:</div>
            <div>{departureTime}</div>
            {flight.departure.terminal && (
              <div>Terminal: {flight.departure.terminal}</div>
            )}
            {flight.departure.gate && (
              <div>Gate: {flight.departure.gate}</div>
            )}
          </AirportInfo>

          <AirportInfo>
            <div style={{ color: '#666' }}>Arrival:</div>
            <div>{arrivalAirport}</div>
            {arrivalTime !== 'N/A' && <div>{arrivalTime}</div>}
            {flight.arrival.terminal && (
              <div>Terminal: {flight.arrival.terminal}</div>
            )}
            {flight.arrival.gate && (
              <div>Gate: {flight.arrival.gate}</div>
            )}
          </AirportInfo>
        </FlightInfo>

        {flight.aircraft?.model && (
          <div style={{ marginTop: 8 }}>
            <strong>Aircraft:</strong> {flight.aircraft.model}
            {flight.aircraft.reg && ` (${flight.aircraft.reg})`}
          </div>
        )}
      </FlightCard> 
    );
  };

  return (
    <Container>
      <Title>Flight Status</Title>

      <Card>
        <SectionTitle>Flight Lookup</SectionTitle>
        <SearchContainer>
          <StyledInput 
            placeholder="Flight number (e.g. DL47)" 
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
          />
          <RoundedButton width="86px" hoverBackgroundColor="#1AA17F" color="black" onClick={handleSearch} disabled={manualLoading}>
            {manualLoading ? 'Loading...' : 'Search'}
          </RoundedButton>
        </SearchContainer>

        {manualError && <ErrorMessage>Error fetching flight data</ErrorMessage>}

        {manualLoading ? (
          <LoadingSpinner>Loading...</LoadingSpinner>
        ) : manualLookup && (
          <ListContainer>
            {manualLookup.map((flight) => (
              <div key={`flight-${flight.number}`}>
                {renderFlightStatus(flight)}
              </div>
            ))}
          </ListContainer>
        )}
      </Card>

      <Card>
        <SectionTitle>Flight Data</SectionTitle>
        <SearchContainer>
          <StyledInput 
            placeholder="Flight number" 
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
          />
               <StyledInput
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </SearchContainer>
         {historicalError && (
          <ErrorMessage>Error fetching historical data</ErrorMessage>
        )}

        {historicalLoading ? (
          <LoadingSpinner>Loading...</LoadingSpinner>
        ) : historicalStatus && (
          <ListContainer>
            {historicalStatus.map((flight) => (
              <div key={`hist-${flight.number}`}>
                {renderFlightStatus(flight)}
              </div>
            ))}
          </ListContainer>
        )}
      </Card>
    </Container>
  );
};

export default FlightStatus;
 
 
