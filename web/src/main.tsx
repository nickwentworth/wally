import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ProtectedLayout } from './ProtectedLayout';
import { Transactions } from './routes/Transactions';
import { Categories } from './routes/Categories';
import { Settings } from './routes/Settings';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/trpc';
import { PublicLayout } from './PublicLayout';
import { Login } from './routes/Login';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* Protected routes, requiring an authenticated user */}
                    <Route element={<ProtectedLayout />}>
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

                    {/* Public routes open to any visitors */}
                    <Route element={<PublicLayout />}>
                        <Route path='/login' element={<Login />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
);
