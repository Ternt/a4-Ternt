import { Outlet } from 'react-router'
import { AppShell, NavLink } from "@mantine/core"

import AuthProvider from '../components/AuthProvider.tsx'
import GithubLogin from '../components/GithubLogin'

export default function AppLayout() {
    return (
        <AuthProvider>
            <AppShell
                header={{ height: '3.6rem' }}>
                <AppShell.Header>
                    <header className="navigationMenuRoot">
                        <ul className="navigationMenuList">
                            <li className="navigationMenuItem">
                                <NavLink unstyled className="NavLink" label="Card Collector" />
                            </li>
                        </ul>
                        <ul className="navigationMenuList">
                            <li className="navigationMenuItem">
                                <GithubLogin />
                            </li>
                        </ul>
                    </header>
                </AppShell.Header>
                <AppShell.Main>
                    <Outlet />
                </AppShell.Main>
            </AppShell>
        </AuthProvider>
    );
};
