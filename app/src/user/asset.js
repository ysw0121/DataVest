import React, { useState, useEffect } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Badge, Table, Layout, Menu, Card, Row, Col, notification, theme,InputNumber ,Input,Button, Alert} from 'antd';
import { UserOutlined, StockOutlined, BackwardOutlined, InfoCircleOutlined, RadarChartOutlined, FileSearchOutlined,TransactionOutlined} from '@ant-design/icons';

import { useToken } from '../TokenContext';

const { Header, Sider, Content } = Layout;

// 侧栏的条目
const items = [
  {
    key: 'mine',
    icon: <UserOutlined />,
    label: '个人中心',
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
          defaultSelectedKeys={['/asset']}
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

// 用户资产组件，负责从后台获取数据并显示用户持有的资金和交易记录。
const AssetContent = () => {
  const [assets, setAssets] = useState([]);
  
  const { getToken, setToken, removeToken } = useToken();

  const [sellingQuantity,setSellingQuantity]=useState();

  const [alertMessage, setAlertMessage] = useState(null); // 新增状态变量用于存储提示信息

  const handleStockQuantityChange = (value) => {
    setSellingQuantity(value);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = () => {
  axios.post('/search_newprice', {}, {
    headers: { Authorization: 'Bearer ' + getToken() },
  })
  .then(response => {
    setAssets(response.data);
  })
  .catch(error => {
    console.log(error);
  });
};

  const handleSellStock = (record) => {
  axios.post('/sellstock', {
    stock_code: record.stock_code,
    stock_quantity: sellingQuantity,
    stock_price: record.stock_price,
    stock_name: record.stock_name
  },{
    headers: { Authorization: 'Bearer ' + getToken() },
  })
  .then(response => {
    fetchAssets(); // 更新资产数据
    if(sellingQuantity>0){
      setAlertMessage({ type: 'success', message: '卖出成功！' });
    }else{
      setAlertMessage({ type: 'success', message: '买入成功！' });
    }
    
    setSellingQuantity(""); 
  })
  .catch(error => {
    console.log(error);
    setAlertMessage({ type: 'error', message: '卖出失败，请稍后再试。' });
  });
};

  const columns2 = [
  {
    title: '股票代码',
    dataIndex: 'stock_code',
    key: 'stock_code',
  },
  {
    title: '股票名称',
    dataIndex: 'stock_name',
    key: 'stock_name',
  },
  {
    title: '实时价格',
    dataIndex: 'stock_price',
    key: 'stock_price',
  },
  {
    title: '持有数量',
    dataIndex: 'stock_num',
    key: 'stock_num',
  },
  {
    title: '卖出数量',
    dataIndex: 'stock_quantity',
    key: 'stock_quantity',
    render: (text, record) => (
    <InputNumber max={record.stock_num} value={record.stock_quantity} onChange={(value) => handleStockQuantityChange(value)} />
  ),
  },
  {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <Button onClick={() => handleSellStock(record)}>卖出</Button>
    ),
  }
];


    return (
        <Row gutter={[16, 8]}>
          <Col span={24}>
            {alertMessage && (
          <Alert
            message={alertMessage.message}
            type={alertMessage.type}
            showIcon
            closable
            onClose={() => setAlertMessage(null)}
            style={{ marginTop: '20px' }}
          />
        )}
          <h1> </h1>
          <Table
            columns={columns2}
             dataSource={assets}
               pagination={false}
             bordered
            title={() => (
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>股票</div>
            )}
           />
            </Col>
          
        </Row>
      );
    };

// 顶级组件，包含 CustomLayout 和 AssetContent 组件，并向 AssetContent 传递 token 作为属性。
const Asset = () => {
  return (
    <CustomLayout>
      <AssetContent />
    </CustomLayout>
  );
};

export default Asset;