import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from 'react-router'

// @ts-expect-error: for suppressing webstorm import errors. There isn't anything wrong
import '@mantine/core/styles.css';
// @ts-expect-error: for suppressing webstorm import errors. There isn't anything wrong
import "@/styles/main.css"

// Routes
import AppLayout from './routes/AppLayout'
import Home from './routes/Home'

const theme = createTheme({});
createRoot(document.body).render(
    <StrictMode>
        <MantineProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route index element={<Home />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    </StrictMode>
);
