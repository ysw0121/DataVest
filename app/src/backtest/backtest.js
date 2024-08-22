import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Layout, Menu, theme, Row, Col, Form, Input, Select, Statistic, Button, Descriptions, notification, Card, Table} from 'antd';
import {
  UserOutlined,
  StockOutlined,
  BackwardOutlined,
  InfoCircleOutlined,
  RadarChartOutlined,
  FileSearchOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useToken } from '../TokenContext';

import Manual from './manual'; // 引入 Manual 组件
const { Header, Sider, Content } = Layout;
const { Option } = Select;

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


const BacktestForm = ({ onSubmit }) => {
  const [initialCash, setInitialCash] = useState(500000);
  const [strategy, setStrategy] = useState('buy_with_stop_loss');
  const [param, setParam] = useState({
    stock_code: '600000',
    percent: 1,
    stop_loss_pct: 10,
    stop_profit_pct: 10,
    start_date: '20200131',
    end_date: '20240228'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParam({
      ...param,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      initial_cash: initialCash,
      strategy_name: strategy,
      param
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label="初始资金">
        <Input type="number" value={initialCash} onChange={(e) => setInitialCash(e.target.value)} />
      </Form.Item>
      <Form.Item label="策略">
        <Select value={strategy} onChange={(value) => setStrategy(value)}>
          <Option value="buy_with_stop_loss">Buy with Stop Loss</Option>
          <Option value="buy_low">Buy Low</Option>
          <Option value="macd_hma_cross">MACD and HMA Combination</Option>
          <Option value="macd_cross">MACD Golden and Death Cross</Option>
          <Option value="rsi_strategy">RSI Strategy</Option>
        </Select>
      </Form.Item>
      <Form.Item label="股票代码">
        <Input type="text" name="stock_code" value={param.stock_code} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="持仓百分比">
        <Input type="number" name="percent" value={param.percent} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="止损百分比">
        <Input type="number" name="stop_loss_pct" value={param.stop_loss_pct} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="止盈百分比">
        <Input type="number" name="stop_profit_pct" value={param.stop_profit_pct} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="起始日期">
        <Input type="text" name="start_date" value={param.start_date} onChange={handleChange} />
      </Form.Item>
      <Form.Item label="终止日期">
        <Input type="text" name="end_date" value={param.end_date} onChange={handleChange} />
      </Form.Item>
      <Button type="primary" onClick={handleSubmit}>开始回测</Button>
    </Form>
  );
};

const BacktestResults = ({ result }) => {
  if (!result || typeof result !== 'string') {
    return <div>No data available</div>;
  }

  const parsedResult = JSON.parse(result);
  if (!parsedResult.data || !parsedResult.columns) {
    return <div>No data available</div>;
  }

  const metrics = parsedResult.data.map((item) => ({
    name: item[0],
    value: item[1],
  }));

  const nameMapping = {
    total_return_pct: "总收益率（%）",
    max_drawdown_pct: "最大回撤率（%）",
    avg_return_pct: "平均收益率（%）",
    sharpe: "夏普比率（%）",
    sortino: "索提诺比率（%）",
    upi: "风险调整绩效指数"
  };

  return (
    <Row gutter={[16, 16]}>
      {metrics.map((metric, index) => (
        <Col span={8} key={index}>
          <Card>
            <Statistic title={nameMapping[metric.name] || metric.name} value={metric.value} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};


const Backtest = () => {
  const [result, setResult] = useState(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedStocks, setRecommendedStocks] = useState([]);
  const [showBacktest, setShowBacktest] = useState(false);
  const { getToken, setToken, removeToken } = useToken();

  // 新增的内容，将参数格式化，以实现可以正常向后端传参数。
  const convertValuesToString = (obj, keys) => {
    for (const key in obj) {
      if (keys.includes(key)) {
        obj[key] = obj[key].toString();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        convertValuesToString(obj[key], keys);
      }
    }
  };
  
  // 处理用户点击 “查看推荐”
  const handleRecommendation = () => {
    // 为提升用户使用体验, 降低等待时间，我们小组成员会每天执行选股算法，并更新此参数。
    setRecommendedStocks(["430564", "430685", "830779", "830832", "430718"]);
    setShowRecommendation(true);
    setShowBacktest(false);
  };
  const keysToConvert = ['initial_cash', 'percent', 'stop_profit_pct', 'stop_loss_pct'];
  
  // 当用户点击
  const handleBacktest = async (params) => {
    console.log(typeof(params))
    console.log(params)
    convertValuesToString(params, keysToConvert);
    console.log(params)
    // 注意 post 请求后面的 URL ，应该也可以只写'/strategy'
    try {
      const response = await axios.post('/strategy',  params,{
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
      });
      console.log(response.data);
      setResult(response.data);
      console.log(typeof(response.data))
      console.log(1)
      setShowBacktest(true);
      setShowRecommendation(false);
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Backtest Error',
        description: 'Failed to run backtest. Please try again later.',
      });
    } 
  };

  return (
    <CustomLayout>
      <Row gutter={[36, 30]}>
        <Col span={8}>
        <Card>
            <p>DataVest 可以利用莫伦卡选股策略</p>
            <p>为您推荐几支不赖的股票。</p>
            <Button type="primary" onClick={handleRecommendation}>查看推荐</Button>
          </Card>
          <h1></h1>
          <h2>回测参数</h2>
          <BacktestForm onSubmit={handleBacktest} /> 
        </Col>
        <Col span={16}>
            {showRecommendation && (
              <Table dataSource={recommendedStocks.map(stock => ({ recommendedStock: stock }))} columns={[{ title: '推荐的股票代码', dataIndex: 'recommendedStock', key: 'recommendedStock' }]} />
            )}
            {showBacktest && (
              <BacktestResults result={result} />
            )}
            </Col>
      </Row>
    </CustomLayout>
  );
};

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
            items={[{ key: '1', label: '回测' }, { key: '2', label: '策略手册' }]}
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

export default Backtest;