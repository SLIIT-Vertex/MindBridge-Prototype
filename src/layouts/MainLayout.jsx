import { Outlet } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

export default function MainLayout() {
  return (
    <div className="pb-20">
      <Outlet />
      <BottomNavigation />
    </div>
  );
}
