import React from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Empty } from 'antd';
import {  Trash, Mail, CheckCircle } from 'lucide-react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '../../store/store';
import { fetchUsers } from '../../store/slices/userSlice';
import { AppDispatch } from '../../store/store';
import { useState } from 'react';
import { userService } from '../../services/api';
// import { title } from 'framer-motion/client';


const UserList: React.FC = () => {
  const { users, loading } = useSelector((state: RootState) => state.users);

  const dispatch = useDispatch<AppDispatch>();
  const [deleteReasonForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  // console.log("users", users);


  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);



  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'number',
      key: 'number',
    },
    // {
    //   title: 'Address',
    //   dataIndex: 'address',
    //   key: 'address',
    // },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
         
          {record.isActive ? (
            <Button
              type="text"
              icon={<Trash size={16} />}
              className="text-red-600 hover:text-red-800"
              onClick={() => showDeleteConfirm(record)}
            />
          ) : (
            <Button
              type="text"
              icon={<CheckCircle size={16} />}
              className="text-green-600 hover:text-green-800"
              onClick={() => handleActivate(record)}
            />
          )}

          <Button type="text" icon={<Mail size={16} onClick={() => handleEmailClick(record.email)} />} className="text-purple-600 hover:text-purple-800" />
        </Space>
      ),

    },
  ];

  
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);


  const handleDeleteUser = async (userId: any, reason: string) => {
    const isCurrentlyActive = selectedUser?.isActive;

    console.log("user coming in delete function ", isCurrentlyActive);

    const hideLoading = message.loading(
      `${isCurrentlyActive ? 'Deactivating' : 'Activating'} User...`,
      0
    );

    try {
      const action = isCurrentlyActive ? 'deactivate' : 'activate';

      const response = await userService.deleteUser(userId, { reason, action });
      hideLoading();
      if (response && response.message) {
        message.success(response.message); // Show success message
      } else {
        message.success('User deleted successfully');
      }
      setDeleteModalVisible(false);
      deleteReasonForm.resetFields();
      setIsActivateUser(false);
      dispatch(fetchUsers()); // Refresh user list
    } catch (error: any) {
      console.log("error", error);

      hideLoading();
      if (error.response && error.response.data && error.response.data.message) {
        message.error(error.response.data.message); // Show backend error message
      } else {
        message.error('Failed to delete user. Please try again.');
      }
    }
  };

  const showDeleteConfirm = (user: any) => {
    setUserToDelete(user.id);
    setDeleteModalVisible(true); // Show confirmation modal
    setSelectedUser(user);
  };


  const [isActivateUser, setIsActivateUser] = useState(false);
  const handleActivate = (user: any) => {
    setSelectedUser(user);
    setIsActivateUser(true);
  }

  // email send

  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  // const [recipient, setRecipient] = useState('');



  const handleEmailClick = (email: string) => {
    emailForm.resetFields();
    emailForm.setFieldsValue({
      email: email,
      subject: '',
      content: '',
    })
    setIsEmailModalVisible(true); // Open the modal
  };

  const handleSendEmail = async (values: { subject: string, content: string, email: string }) => {
    const hideLoading = message.loading('Sending email...', 0);
    try {
      const response = await userService.sendEmail({
        email: values.email,
        subject: values.subject,
        content: values.content,
      }); 

      hideLoading();

      if (response && response.message) {
        message.success(response.message); // Show success message
      } else {
        message.success('Email sent successfully');
      }
      emailForm.resetFields();
      setIsEmailModalVisible(false); // Close the modal after success
    } catch (error: any) {
      hideLoading();
      console.error('Failed to send email:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);  // Show backend error message
      } else {
        message.error('An error occurred while sending the email.');
      }

    }
  };


  // Function to reset form when modal is closed
  const handleCloseModal = () => {
    emailForm.resetFields(); // Clears form fields when closing the modal
    setIsEmailModalVisible(false);
  };



  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
      
      </div>
      <Table
        columns={columns}
        dataSource={users || []}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          total: users.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
        }}
        scroll={{ x: true }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No users found"
            />
          ),
        }}
      />

  

      {/* delete */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={null}
      >
        <p>Are you sure you want to delete this user?</p>

        {/* Simple AntD Form */}
        <Form layout="vertical" className='mt-4' form={deleteReasonForm}
          onFinish={(values) => handleDeleteUser(userToDelete!, values.reason)}>
          <Form.Item label="Reason for Deletion" name="reason" rules={[{ required: true, message: "Please provide a reason!" }]}>
            <Input.TextArea rows={4} placeholder="Enter reason for deleting this user..." />
          </Form.Item>

          <Form.Item>
            <Button onClick={() => setDeleteModalVisible(false)} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" danger>
              Delete User
            </Button>
          </Form.Item>

        </Form>
      </Modal>

      {/* Activate  */}

      <Modal
        title="Activate User"
        open={isActivateUser}
        onCancel={() => setIsActivateUser(false)}
        onOk={() => handleDeleteUser(selectedUser.id, '')}
      >

      </Modal>

      {/* email send */}
      <Modal
        title="Send Email"
        visible={isEmailModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <Form layout="vertical" form={emailForm} onFinish={handleSendEmail}>
          <Form.Item label="Recipient" name="email"  >
            <Input disabled />
          </Form.Item>

          <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Content" name="content" rules={[{ required: true }]}>
            <Input.TextArea rows={6} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Email
            </Button>
          </Form.Item>
        </Form>
      </Modal>


    </div>
  );
};

export default UserList;