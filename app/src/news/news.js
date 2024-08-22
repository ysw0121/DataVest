import React, { useState, useEffect} from 'react';
import { Layout, Menu, theme, List, Typography } from 'antd';
import { UserOutlined, StockOutlined, BackwardOutlined, CommentOutlined, RadarChartOutlined, FileSearchOutlined ,TransactionOutlined} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

// 侧栏的条目
const items = [
  { 
    key: 'mine', 
    icon: <UserOutlined />,
    label: '个人中心',
    children: [
      { key: '/user', label: '个人资料' },
      { key: '/asset', label: '我的资产' },
    ],
  },
  { key: '/stock', icon: <StockOutlined />, label: '股票中心' },
  { key: '/record', icon: <TransactionOutlined />, label: '交易记录' },
  { key: '/backtest', icon: <BackwardOutlined />, label: '回测' },
  { key: '/questionnaire', icon: <RadarChartOutlined />, label: '风险偏好评估' },
  { key: '/news', icon: <FileSearchOutlined />, label: '今日新闻' },
  { key: '/us', icon: <CommentOutlined />, label: '关于我们' },
];

// 布局组件，用于设置整体的页面布局，包括侧边栏和内容区域。
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

const NewsPage = () => {
  // 硬编码的新闻数据
  const newsData = [
    {
      id: 1,
      title: '美国经济数据频频“打架”，美联储决议或再掀市场波澜',
      image: process.env.PUBLIC_URL + '/news1.jpg',
      description: '美国近期经济数据显示出矛盾信号，特别是就业市场数据的不一致，引发市场对经济状况的担忧。\
      美联储即将召开会议，市场高度关注其政策决策，预计将对市场产生重大影响。\
      同时，美国股市和债市的最新动态，以及全球经济环境对美国经济及美联储政策的影响也备受瞩目。\
      当前美国经济形势充满不确定性，市场密切关注美联储的政策走向，以寻找经济前景的线索。',
      url: 'https://finance.sina.com.cn/jjxw/2024-06-10/doc-inayfuvc0250022.shtml',
      time: '2024-06-12 10:30',
      source: '新浪财经网',
    },
    {
      id: 2,
      title: '今年6·18快递“无战事”：预售制取消后爆仓、涨价不再，日薪400元招工“消失”',
      image: process.env.PUBLIC_URL + '/news2.jpg',
      description: '今年的618大促与往年有些不同，自4月起，天猫、京东、快手等主流平台相继官宣取消预售，\
      打出“现货开卖”标签，这意味着消费者不用再被“烧脑”的优惠计算题困住，即买即送。\
      与往年不同，今年快递业未出现爆仓和涨价现象，同时日薪400元的招工也减少了。\
      尽管有这些变化，今年618期间的快递单量仍然实现了平稳增长，且快递价格保持稳定。',
      url: 'https://finance.ifeng.com/c/8aFWa5vWwrU',
      time: '2024-06-12 12:45',
      source: '凤凰财经',
    },
    {
      id: 3,
      title: '天风证券：给予千红制药增持评级',
      image: process.env.PUBLIC_URL + '/news3.jpg',
      description: '天风证券（601162）股份有限公司杨松近期对千红制药（002550）进行研究并发布了研究报告\
      《2023年业绩承压，2024Q1毛利率提升明显》，本报告对千红制药给出增持评级，当前股价为5.56元。',
      url: 'https://stock.10jqka.com.cn/20240610/c658683040.shtml',
      time: '2024-06-12 11:26',
      source: '同花顺',
    },
    {
      id: 4,
      title: '今日开售！十分火爆！',
      image: process.env.PUBLIC_URL + '/news4.jpg',
      description: '2024年第三期和第四期储蓄国债（电子式）在银行渠道正式开售，销售情况十分火爆。\
      这两期国债均为固定利率、固定期限品种，最大发行额合计500亿元。\
      第三期国债期限3年，票面年利率2.38%；第四期国债期限5年，票面年利率2.5%。\
      此外，总额350亿元的50年期超长期特别国债也将于6月14日发行，用于国家重大战略实施和重点领域安全能力建设。',
      url: 'https://www.yangtse.com/zncontent/3816462.html',
      time: '2024-06-12 16:52',
      source: '扬子晚报',
    },
    {
      id: 5,
      title: '盛文兵：非农数据打压降息预期，金价强势下跌',
      image: process.env.PUBLIC_URL + '/news5.jpg',
      description: '美国非农数据强劲，打压金价并降低市场对美联储降息预期。\
      全球央行降息和中国央行暂停购买黄金，进一步对金价施压。\
      同时，沙特和俄罗斯的增产计划暂停或逆转，为原油价格提供支撑，但全球经济增长放缓可能影响原油需求。\
      投资者密切关注美联储货币政策走向及其对市场的影响。',
      url: 'https://forex.hexun.com/2024-06-10/213119091.html',
      time: '2024-06-12 8:09',
      source: '和讯网',
    },
    {
      id: 6,
      title: '日本干预汇率是有历史传承的',
      image: process.env.PUBLIC_URL + '/news6.png',
      description: '日本为阻挡日元升值，于2024年5月动用近10万亿日元干预汇市，这是继2022年9月至10月间两次干预后的又一次重要举措。\
      历史上，日本在1991年至2004年间几乎每年都会干预汇市，而2010年至2011年间更是为了阻挡日元过度升值进行了大规模干预。\
      尽管如此，日本央行的货币政策态度仍是主导日元汇率走势的关键因素。',
      url: 'https://finance.sina.com.cn/stock/hkstock/hkstocknews/2024-06-10/doc-inayfuve4878381.shtml?finpagefr=p_108',
      time: '2024-06-12 9:32',
      source: '新浪财经网',
    },
    // 其他新闻数据
  ];

  return (
    <Content style={{ padding: '0 50px', marginTop: '20px' }}>
      <Title level={1} style={{ textAlign: 'center', margin: '20px 0' }}>今日新闻</Title>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={newsData}
        renderItem={item => (
          <List.Item
            key={item.id}
            extra={<img width={150} alt="logo" src={item.image} />}
          >
            <List.Item.Meta
              title={<Link to={item.url} target="_blank" rel="noopener noreferrer">{item.title}</Link>}
              description={<>
                <div>{item.description}</div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: 'gray' }}>{item.time} | {item.source}</div>
              </>}
            />
          </List.Item>
        )}
      />
    </Content>
  );
};

const News = () => {
  return (
    <CustomLayout>
      <NewsPage />
    </CustomLayout>
  );
};

export default News;