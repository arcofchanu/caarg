import React from 'https://esm.sh/react@^19.1.1';
import { customModelIconBase64 } from '../config';

type IconProps = {
  className?: string;
};

export const UserIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="7" />
  </svg>
);

export const ModelIcon: React.FC<IconProps> = ({ className }) => (
  <img
    src={customModelIconBase64}
    alt="AI Model Icon"
    // The parent container in ChatMessage provides the circular shape
    className={`${className} rounded-full object-cover`}
  />
);


export const SendIcon: React.FC<IconProps> = ({ className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
);
