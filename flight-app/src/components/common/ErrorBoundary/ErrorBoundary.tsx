import React, { ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: 1rem;
  background: #ffecec;
  border: 1px solid #ff6b6b;
  border-radius: 4px;
  margin: 1rem 0;
  color: #ff6b6b;
`;

const ErrorTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #ff6b6b;
`;

const ErrorDetails = styled.pre`
  white-space: pre-wrap;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem;
  border-radius: 3px;
`;

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          {this.props.showDetails && this.state.error && (
            <ErrorDetails>
              {this.state.error.toString()}
              {this.state.errorInfo?.componentStack}
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
