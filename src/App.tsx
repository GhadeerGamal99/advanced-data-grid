
import './App.css';

import { lazy, Suspense } from 'react';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'; 
import React from 'react';
import { Example } from './components/Example';

const ReactQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then(
    (d) => ({
      default: d.ReactQueryDevtools,
    }),
  ),
);
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
      <Suspense fallback={null}>
        <ReactQueryDevtoolsProduction />
      </Suspense>
    </QueryClientProvider>

    
  );
}

export default App;
