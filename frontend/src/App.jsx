import AppRoutes from './routes/AppRoutes.jsx';
import { ToastContainer } from './components/common/Toast.jsx';

/**
 * Root application component.
 * Routing is delegated to AppRoutes.
 * ToastContainer is mounted once here so toasts render above everything.
 */
function App() {
  return (
    <>
      <ToastContainer />
      <AppRoutes />
    </>
  );
}

export default App;
