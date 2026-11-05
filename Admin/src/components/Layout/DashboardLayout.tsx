import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Package,
  FolderTree,
  BookOpen,
  Quote,
  // Sliders,
  LogOut,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store/store';
import "./style.css";

const { Sider, Content } = Layout;

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Layout className="min-h-screen">
      <Sider
        width={250}
        className="bg-[rgb(31,41,55)] fixed h-screen overflow-hidden z-20"
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Admin Profile Header */}
          <div className="p-4 text-center border-b border-gray-700/80 flex flex-col items-center gap-2 shrink-0">
            <img
              src="/favicon.png"
              alt="Logo"
              className="w-11 h-11 object-contain rounded-full shadow-md bg-[#081516] p-1 border border-cyan-500/40"
            />
            <h2 className="text-xl font-semibold text-white tracking-wide">{user?.name || 'Admin'}</h2>
            <p className="text-gray-400 text-xs truncate max-w-[210px]">{user?.email || 'admin@example.com'}</p>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-2">
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              onClick={({ key }) => {
                navigate(key);
              }}
              className="bg-[rgb(31,41,55)] text-white border-none"
              items={[
                {
                  key: '/dashboard',
                  icon: <LayoutDashboard size={18} />,
                  label: 'Dashboard',
                },
                {
                  key: '/dashboard/categories',
                  icon: <FolderTree size={18} />,
                  label: 'Categories',
                },
                {
                  key: '/dashboard/products',
                  icon: <Package size={18} />,
                  label: 'Product',
                },
                {
                  key: '/dashboard/blogs',
                  icon: <BookOpen size={18} />,
                  label: 'News and media',
                },
                {
                  key: '/dashboard/queries',
                  icon: <MessageSquare size={18} />,
                  label: 'Queries',
                },
                {
                  key: '/dashboard/testimonials',
                  icon: <Quote size={18} />,
                  label: 'Testimonials',
                },
                // {
                //   key: '/dashboard/banners',
                //   icon: <Sliders size={18} />,
                //   label: 'Banners',
                // },
                {
                  key: '/dashboard/pages',
                  icon: <FileText size={18} />,
                  label: 'Pages',
                },
              ]}
            />
          </div>

          {/* Logout / Sign Out Button at Bottom */}
          <div className="p-3 border-t border-gray-700/80 shrink-0 bg-[rgb(24,32,44)]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 transition-all duration-200 cursor-pointer shadow-sm"
            >
              <LogOut size={18} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 250 }}>
        <Content className="p-6 bg-gray-50 min-h-screen">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
