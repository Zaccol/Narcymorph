
import React from 'react';

interface SpinnerProps {
    small?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ small = false }) => {
  const sizeClass = small ? 'w-5 h-5' : 'w-12 h-12';
  const borderClass = small ? 'border-2' : 'border-4';

  return (
    <div
      className={`${sizeClass} ${borderClass} border-fuchsia-500 border-t-transparent rounded-full animate-spin`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
