declare module 'react-qr-scanner' {
  import { FC } from 'react';

  interface QrReaderProps {
    delay?: number | false;
    onError?: (error: Error) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    className?: string;
    facingMode?: 'user' | 'environment';
    legacyMode?: boolean;
    resolution?: number;
    showViewFinder?: boolean;
    constraints?: MediaTrackConstraints;
  }

  const QrReader: FC<QrReaderProps>;
  export default QrReader;
}