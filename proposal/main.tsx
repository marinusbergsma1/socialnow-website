import React from 'react';
import { createRoot } from 'react-dom/client';
import WebsiteProposal from './WebsiteProposal';
import './website.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><WebsiteProposal /></React.StrictMode>,
);
