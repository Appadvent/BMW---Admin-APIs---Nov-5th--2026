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
  // Building2,
  // Briefcase,
  Quote,
  Sliders,
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
        className="bg-[rgb(31,41,55)] fixed h-screen overflow-hidden"
        style={{ position: 'fixed', height: '100vh', left: 0, top: 0 }}
      >
        <div className="p-4 text-center border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">{user?.name || 'Admin'}</h2>
          <p className="text-gray-300 text-sm">{user?.email || 'admin@example.com'}</p>
        </div>
        <div className="flex flex-col h-[calc(100vh-80px)]">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={({ key }) => {
              if (key === 'logout') {
                handleLogout();
              } else {
                navigate(key);
              }
            }}
            className="bg-[rgb(31,41,55)] text-white border-none flex-grow"
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
              {
                key: '/dashboard/banners',
                icon: <Sliders size={18} />,
                label: 'Banners',
              },
              {
                key: '/dashboard/pages',
                icon: <FileText size={18} />,
                label: 'Pages',
              },

              // {
              //   key: '/dashboard/abouts',
              //   icon: <Building2 size={18} />,
              //   label: 'About',
              // },

              // {
              //   key: '/dashboard/services',
              //   icon: <Briefcase size={18} />,
              //   label: 'Services',
              // },
            ]}
          />
          <Menu
            mode="inline"
            className="bg-[rgb(31,41,55)] text-white border-none mt-auto"
          >
            <Menu.Item
              key="logout"
              icon={<LogOut size={18} />}
              danger
              onClick={handleLogout}
            >
              Logout
            </Menu.Item>
          </Menu>
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