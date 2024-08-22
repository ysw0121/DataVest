import React, { useState, useEffect } from 'react';
import axios from "axios";
import {  Layout, Menu, Typography, Row, Col, Descriptions, Badge, Select, Card, Avatar } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  StockOutlined,
  BackwardOutlined,
  RadarChartOutlined,
  FileSearchOutlined,
  CommentOutlined,
  TransactionOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer} = Layout;
const { Title, Paragraph } = Typography;

const items = [
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
    { key: '/us', icon: <CommentOutlined />, label: '关于我们' },
];

const CustomLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} collapsedWidth={0} style={{ background: '#001529', position: 'fixed', left: 0, height: '100vh' }}>
        <div className="demo-logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', padding: '16px' }}>Datavest</div>
        <Menu
          theme="dark"
          mode="inline"
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
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Yuxin Zhang',
      position: '框架搭建与后端开发',
      description: 'Yuxin Zhang是一位在框架搭建与后端开发领域有着丰富经验的专家，能快速理解和分析客户需求，熟练进行软件开发。',
      avatar: '/zyx.jpg',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/alicezhang',
        twitter: 'https://twitter.com/alicezhang',
      },
    },
    {
      name: 'Qiaolei Chen',
      position: '前端开发',
      description: 'Qiaolei Chen是一位经验丰富的前端开发者，在构建现代化、响应式和用户友好的Web应用方面具有深厚的专业知识。',
      avatar: '/cql.jpg',
      socialLinks: {
        linkedin: 'https://www.linkedin.com/in/bobli',
        twitter: 'https://twitter.com/bobli',
      },
    },
    {
        name: 'Wonder',
        position: '前端开发',
        description: 'Wonder是一位专注于前端开发的工程师，具备将设计原型转化为交互式网页的能力，熟练掌握网页渲染、前端框架和库。',
        avatar: '/wde.jpg',
        socialLinks: {
          linkedin: 'https://www.linkedin.com/in/bobli',
          twitter: 'https://twitter.com/bobli',
        },
      },
      {
        name: 'Siwen Yu',
        position: '后端开发与选股策略',
        description: 'Siwen Yu 是资深的软件工程师，擅长分布式系统和高性能计算，在量化选股策略和后端系统架构设计方面具有丰富的经验。',
        avatar: '/ysw.jpg',
        socialLinks: {
          linkedin: 'https://www.linkedin.com/in/bobli',
          twitter: 'https://twitter.com/bobli',
        },
      },
    // 更多团队成员...
  ];

  return (
    <CustomLayout>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <Title level={1} style={{ textAlign: 'center', margin: '20px 0' }}>关于我们</Title>
        <Title level={2}>我们的团队</Title>
        <Row gutter={[16, 16]}>
          {teamMembers.map(member => (
            <Col span={6} key={member.name}>
              <Card
                style={{ textAlign: 'center' }}
                cover={<img alt={member.name} src={member.avatar} />}
              >
                <Card.Meta
                  avatar={<Avatar src={member.avatar} />}
                  title={member.name}
                  description={(
                    <>
                      <Paragraph>{member.position}</Paragraph>
                      <Paragraph>{member.description}</Paragraph>
                      <Paragraph>
                        <a href={member.socialLinks.linkedin}>LinkedIn</a> | <a href={member.socialLinks.twitter}>Twitter</a>
                      </Paragraph>
                    </>
                  )}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Title level={2} style={{ marginTop: '40px' }}>项目背景</Title>
        <Paragraph>
          我们的量化交易模拟平台旨在通过先进的技术和智能算法，为用户提供精准的选股建议和高效的投资策略。
          自2024年创立以来，平台经过不断迭代和优化，现已成为业内领先的交易工具。
          通过结合大数据分析和机器学习算法，我们的平台能够准确捕捉市场趋势，并为用户提供个性化的交易信号。
          此外，我们还通过问卷调查收集用户的行为数据，以进一步优化和改进平台的智能算法，提升用户体验和投资回报。
        </Paragraph>
        <Title level={2} style={{ marginTop: '40px' }}>我们的技术栈</Title>
        <Paragraph>
          平台主要使用的技术和工具包括：
          - 编程语言：Python, JavaScript
          - 框架：React, Flask
          - 数据库：MySQL
          - 工具：npm, Antdesign
        </Paragraph>
        <Title level={2} style={{ marginTop: '40px' }}>联系我们</Title>
        <Paragraph>
          如果您有任何问题或建议，请随时通过以下方式联系我们：
          - 电子邮件：support@quantplatform.com
          - Twitter: <a href="https://twitter.com/quantplatform">@quantplatform</a>
          - LinkedIn: <a href="https://linkedin.com/company/quantplatform">QuantPlatform</a>
        </Paragraph>
      </Content>
      <Footer style={{ textAlign: 'center' }}>© 2024 Datavest. All Rights Reserved.</Footer>
    </CustomLayout>
  );
};

export default AboutUs;