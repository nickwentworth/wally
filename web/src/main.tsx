import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Layout } from './Layout';
import { Transactions } from './routes/Transactions';
import { Categories } from './routes/Categories';
import { Settings } from './routes/Settings';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/trpc';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route
                            index
                            element={<Navigate to='/transactions' />}
                        />
                        <Route
                            path='/transactions'
                            element={<Transactions />}
                        />
                        <Route path='/categories' element={<Categories />} />
                        <Route path='/settings' element={<Settings />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
);
