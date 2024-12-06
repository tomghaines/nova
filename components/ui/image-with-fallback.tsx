import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  height: number;
  width: number;
  className?: string;
}

const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc,
  height,
  width,
  ...props
}: ImageWithFallbackProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <Image
      src={hasError ? fallbackSrc : src}
      alt={alt}
      height={height}
      width={width}
      onError={handleError}
      {...props}
    />
  );
};

export default ImageWithFallback;
