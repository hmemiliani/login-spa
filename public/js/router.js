const routes = {
    '/': showLogin,
    '/register': showRegister,
    '/dashboard': showDashboard,
    '/dashboard/home': showHome,
    '/dashboard/users': showUser,
};

const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';

const findComponentByPath = (path) => routes[path] || showLogin;

const router = () => {
    const path = parseLocation();
    const component = findComponentByPath(path);
    component();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);