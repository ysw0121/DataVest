import React, { useState, useEffect } from 'react';
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Table, Layout, Menu, theme, Button,Pagination, Descriptions, Row, Col, InputNumber,Input, Space ,Alert} from 'antd';
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

import Chart from './stock_K';

const { Header, Sider, Content } = Layout;

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

const CustomLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/register_background.svg)`;
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={0} style={{ background: '#001529', position: 'fixed', left: 0, height: '100vh' }}>
        <div className="demo-logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', padding: '16px' }}>Datavest</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultSelectedKeys={['/stock']}
          onClick={({ key }) => navigate(key)}
          items={items}
          style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: -565, marginTop: 0, marginRight: -755 }}>
        <Header style={{ background: '#001529', padding: '0 16px', flex: 0 }}>
          <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', float: 'left' }}>Datavest</div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={[{ key: '1', label: '股市大盘' }]}
            style={{ flex: 1, justifyContent: 'center', minWidth: 0 }}
          />
          
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

const StockContent = () => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(50); // 总页数
  const [currentPage, setCurrentPage] = useState(1);
  const { getToken, setToken, removeToken } = useToken();
  const pageSize = 10;

  const [stockcode,setstockcode]=useState();
  const [stockname,setstockname]=useState();
  const [stockprice,setstockprice]=useState();
  const [stockquantity, setstockquantity] = useState(1);

  const [chartData, setChartData] = useState({});

  const [alertMessage, setAlertMessage] = useState(null); // 新增状态变量用于存储提示信息

  const columns = [
    {
      title: '股票代码',
      dataIndex: 'f12',
      key: 'f12',
      sorter: (a, b) => a.f12.localeCompare(b.f12),
    },
    {
      title: '股票名称',
      dataIndex: 'f14',
      key: 'f14',
    },
    {
      title: '最新价',
      dataIndex: 'f2',
      key: 'f2',
      sorter: (a, b) => a.f2 - b.f2,
    },
    {
      title: '涨跌幅',
      dataIndex: 'f3',
      key: 'f3',
      sorter: (a, b) => a.f3 - b.f3,
    },
   {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Button onClick={() => handleButtonClick(record.f12,record.f14,record.f2)}>
          显示K线图
        </Button>
      ),
    },
  ];

  useEffect(() => {
    fetchData(currentPage); // 当页面加载时，获取第一页的股票数据
  }, [currentPage]); // 当页数发生变化时重新获取数据

  const fetchData = () => {
    axios.post(`/stockdata?num=${currentPage}`, {}, {
      headers: { Authorization: 'Bearer ' + getToken() },
    })
      .then(response => {
        console.log("get response")
        console.log(response.data)
        setData(response.data)
        console.log(data)
      })
      .catch(error => {
        if (error.response) {
          console.log("fetch but no data")
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  // 获取K线数据的函数
  const fetchData_K = (stockCode) => {
    axios.post(`/stockdata_K?stock_code=${stockCode}`, {}, {
      headers: { Authorization: 'Bearer ' + getToken() },
    })
      .then(response => {
        console.log("get stock K response");
        console.log(response.data);
        setChartData(response.data); // 存储K线数据到状态中
      })
      .catch(error => {
        if (error.response) {
          console.log("fetch stock K but no data");
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  const buy_stock = () => {
    axios({
        method: "POST",
        url: "/buystock",
        headers: { Authorization: 'Bearer ' + getToken() },
        data: {
            stock_code: stockcode,
            stock_name: stockname,
            stock_price: stockprice,
            stock_quantity:stockquantity
        }
    })
    .then((response) => {
        if(response.data.msg=='successful'){
          console.log('购买股票成功');
           setAlertMessage({ type: 'success', message: '购买成功！' });
        }
    })
    .catch((error) => {
        if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
            setAlertMessage({ type: 'error', message: '购买失败，请稍后再试。' });
        }
    });
};

  const handleButtonClick = (stockCode,stockName,stockPrice) => {
    fetchData(currentPage);  // 重新加载股票数据
    setstockcode(stockCode);
    setstockname(stockName);
    setstockprice(stockPrice);
    fetchData_K(stockCode);  // 重新加载K线数据
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);  // 更新页数，触发重新获取数据
  };

  const handleStockQuantityChange = (value) => {
    setstockquantity(value);
    console.log(stockquantity);
  };


  return (
    <Row gutter={[16, 8]}>
      <Col span={10}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          bordered
          title={() => (
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              沪深京A股最新数据
            </div>
          )}
          onChange={handlePageChange}
        />
        <Pagination current={currentPage} total={500} onChange={handlePageChange} />
      </Col>
      <Col span={11}>
        <Chart dataDic={chartData} />
        <div style={{ marginTop: '-120px' }}>
          <h2>是否要购买股票： {stockname}</h2>
          <Space>
            <InputNumber min={100} value={stockquantity} onChange={handleStockQuantityChange} />
            <Button type="primary" onClick={buy_stock}>
              购买
            </Button>
          </Space>
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
        </div>
      </Col>
    </Row>
  );
};


const Stock = () => {
  return (
    <CustomLayout>
      <StockContent  />
    </CustomLayout>
  );
};

export default Stock;