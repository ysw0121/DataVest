import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Layout, Menu, theme, Row, Col, Form, Input, Select, Button, Descriptions, Card } from 'antd';
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


const strategies = [
    {
      title: '止损买入策略',
      description: '即“ Buy with Stop Loss ” ，该策略在持仓时设置止损卖出。当价格达到指定的止损价时，卖出股票，以减少潜在的损失。'
    },
    {
      title: '低价买入策略 ',
      description: '即“ Buy Low ” ，策略在市场价格低于之前的最低价时买入股票。如果已经持有股票，不做任何操作。如果没有持仓且当前价格低于前一天的最低价,则买入股票，买入价格比当前价格低 0.01，并持有 3 个交易日。'
    },
    {
      title: '均线交叉策略',
      description: '即“ Moving Average Crossover "，该策略基于短期和长期移动平均线的交叉来进行交易决策。当短期均线上穿长期均线时买入，当短期均线下穿长期均线时卖出。'
    },
    {
      title: '动量策略 ',
      description: '即“ Momentum ” ，动量策略是基于价格动量进行交易。一般来说，当价格上涨时买入，当价格下跌时卖出。'
    },
    {
      title: '相对强弱指数策略',
      description: '即“ RSI Strategy ” ，基于相对强弱指数（RSI）进行交易。RSI 是一种衡量价格相对强弱的技术指标，通常用于识别超买或超卖状态。'
    }
  ];

const Manual = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
      token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { token } = useToken();
    const navigate = useNavigate();
    const location = useLocation();
  
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={0} style={{ background: '#001529', position: 'fixed', left: 0, height: '100vh' }}>
          <div className="demo-logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', padding: '16px' }}>Logo</div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            defaultSelectedKeys={['/backtest']}
            onClick={({ key }) => navigate(key)}
            items={items}
            style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ marginLeft: -520, marginTop: 0, marginRight: -720 }}>
          <Header style={{ background: '#001529', padding: '0 16px', flex: 0 }}>
            <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', float: 'left' }}>Logo</div>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              onClick={({ key }) => {
                  if (key === '1') {
                    navigate('/backtest');
                  }
              }}
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
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {/* 渲染策略卡片 */}
                {strategies.map((strategy, index) => (
                  <Card key={index} title={strategy.title} style={{ width: 300 }}>
                    <p>{strategy.description}</p>
                  </Card>
                ))}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  };
  
  export default Manual;