// components/withAuthNavBar.js
import React from 'react';
import AuthNavbar from './AuthNavbar';

const withAuthNavBar = (WrappedComponent) => {
    const WithAuthNavBarComponent = (props) => {
        const [mainContentMargin, setMainContentMargin] = React.useState(0);
        const drawerWidth = 240;

        const handleDrawerToggle = (drawerOpen) => {
            if (drawerOpen) {
                setMainContentMargin(drawerWidth);
            } else {
                setMainContentMargin(0);
            }
        };
        return (
            <div>
                <AuthNavbar onDrawerToggle={handleDrawerToggle} />
                <main>
                    <WrappedComponent mainContentMargin={mainContentMargin} {...props} />
                </main>
            </div>
        );
    };

    WithAuthNavBarComponent.displayName = `withAuthNavBar(${getDisplayName(WrappedComponent)})`;
    return WithAuthNavBarComponent;
};

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuthNavBar;

