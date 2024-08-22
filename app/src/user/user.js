import React, { useState, useEffect } from 'react'
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Badge, Table, Layout, Menu, theme, Descriptions, Row, Col, Select, Space, Input, notification } from 'antd';
import './user.css';  // 导入样式
import './user.css';  // 导入样式
import {
  UserOutlined,
  StockOutlined,
  BackwardOutlined,
  InfoCircleOutlined,
  RadarChartOutlined,
  FileSearchOutlined,
  TransactionOutlined,
} from '@ant-design/icons';

import { useToken } from '../TokenContext';

const { Header, Sider, Content } = Layout;

// 侧栏的条目
const items=[
    { 
      key: 'mine', 
      icon: <UserOutlined />,
      label: '个人中心' ,
      children: [
          {
            key: '/user',
            label: '个人资料',
          },
          {
            key: '/asset',
            label: '我的资产',
          },
        ],
      },
    { key: '/stock', icon: <StockOutlined />, label: '股票中心' },
    { key: '/record', icon: <TransactionOutlined />, label: '交易记录' },
    { key: '/backtest', icon: <BackwardOutlined />, label: '回测' },
    { key: '/questionnaire', icon: <RadarChartOutlined />, label: '风险偏好评估' },
    { key: '/news', icon: <FileSearchOutlined />, label: '今日新闻' },
    { key: '/us', icon: <InfoCircleOutlined />, label: '关于我们' },
  ];

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };


 // 布局组件，用于设置整体的页面布局，包括侧边栏和内容区域。
const CustomLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={0} style={{ background: '#001529', position: 'fixed', left: 0, height: '100vh' }}>
        <div className="demo-logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', padding: '16px' }}>Datavest</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultSelectedKeys={['/user']}
          onClick={({ key }) => navigate(key)}
          items={items}
          style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: -565, marginTop: 0, marginRight: -755 }}>
        <Header style={{ background: '#001529', padding: '0 16px', flex: 0 }}>
          <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', float: 'left' }}>Datavest</div>
          
        </Header>
        <Layout>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};


// 用户个人资料组件，负责从后台获取数据并显示用户个人资料。
const UserContent = () => {
  const [userInfo, setUserInfo] = useState({});
  const [phoneNumber, setPhoneNumber] = useState(''); // 新增状态管理电话号码
  const [gender, setGender] = useState(''); // 新增状态管理性别
  const { getToken, setToken, removeToken } = useToken();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    axios.get('/userinfo', {
      headers: { Authorization: 'Bearer ' + getToken() },
    })
    .then(response => {
      setUserInfo(response.data);
    })
    .catch(error => {
      console.log(error);
    });
  };

  const handleGenderChange = (value) => { 
    axios({
              method: "POST",
              url: "/set_gender",
              headers: { Authorization: 'Bearer ' + getToken() },
              data: {
                  user_gender: value
              }
          })
          .then((response) => {
            setGender(value);
          })
          .catch((error) => {
            
          });
        }

    const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const updatePhoneNumber = async () => {
    try {
      await axios.post(
        '/update-phone-number',
        { phone: phoneNumber },
        { headers: { Authorization: 'Bearer ' +  getToken() } }
      );
      notification.success({
        message: '成功',
        description: '电话号码已更新。',
      });
    } catch (error) {
      notification.error({
        message: '错误',
        description: '更新电话号码时出错，请重试。',
      });
    }
  };

  // 用户个人资料条目
  const userItems = [
    { key: '1', label: '昵称', children: userInfo.name || '未提供' },
    { key: '2', label: '邮箱', children: userInfo.email || '未提供' },
    { key: '3', label: '电话号码', children: userInfo.phone || 
      <Space.Compact>
        <Input 
          value={phoneNumber}
          onChange={handlePhoneChange}
          onBlur={updatePhoneNumber}
        />
      </Space.Compact>
      },
    { key: '4', label: '注册时间', children: userInfo.registrationDate || '未提供' },
    { key: '5', label: '余额', children: <Badge status="processing" text={userInfo.status || '未提供'} /> },
    { key: '6', label: '性别', children: userInfo.gender || <Select
    defaultValue="请选择性别"
    style={{ width: 120 }}
    onChange={handleGenderChange}
    options={[
      { value: 'male', label: '男' },
      { value: 'female', label: '女' },
      { value: 'other', label: '其它' },
    ]}
  /> }
  ];

  return (
    <Row gutter={[16, 8]}>
      <Col span={24}>
        <Descriptions
          title={<span style={{ fontWeight: 'bold', fontSize: '24px' }}>个人资料</span>}
          bordered
          items={userItems}
        />
      </Col>
    </Row>
  );
};


// 顶级组件，包含 CustomLayout 和 UserContent 组件，并向 UserContent 传递 token 作为属性。
const User = () => {
  return (
    <CustomLayout>
      <UserContent />
    </CustomLayout>
  );
};

export default User;