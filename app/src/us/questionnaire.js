import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Row, Col, Form, Input, Button, Radio, theme, message, Space, Card} from 'antd';
import {
  UserOutlined,
  StockOutlined,
  BackwardOutlined,
  CommentOutlined,
  RadarChartOutlined,
  FileSearchOutlined,
  TransactionOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;
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



// 布局组件，用于设置整体的页面布局，包括侧边栏和内容区域。
const CustomLayout = ({ children,score }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const location = useLocation();
  

  React.useEffect(() => {
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
          defaultSelectedKeys={['/questionnaire']}
          onClick={({ key }) => navigate(key)}
          items={items}
          style={{ height: 'calc(100vh - 64px)', borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: -565, marginTop: 0, marginRight: -755 }}>
        <Header style={{ background: '#001529', padding: '0 16px' }}>
          <div className="logo" style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Datavest</div>
        </Header>
        <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Row gutter={16}>
            <Col span={18}>
              {children}
            </Col>
            <Col span={6}>
              <Card title="您的评估得分" style={{ width: '100%' }}>
                {/* 分数展示区域 */}
                {score !== null ? (
                  <Paragraph>{`您的总得分为 ${score}`}</Paragraph>
                ) : (
                  <Paragraph>请完成问卷以获取分数</Paragraph>
                )}
              </Card>
            </Col>
          </Row>
          </Content>
      </Layout>
    </Layout>
  );
};

// 问卷内容组件
const QuestionnaireContent = ({ score, onScoreChange }) => {
  const [form] = Form.useForm();
  
  const onFinish = (values) => {
    const scores = {
      age: { '18-30岁': 2, '31-50岁': 6, '51-65岁': 3, '65岁以上': 2 },
      income: { '50万元以下': 2, '50—100万元': 5, '100—500万元': 7.5, '500万元以上': 10 },
      assets: { '现金及现金等价物占比超过50%': 2, '股票、债券等金融资产占比超过50%': 4, '房地产等实物资产占比超过50%': 4, '其他投资（如黄金、艺术品、私募基金等）占比超过50%': 8 },
      investmentRatio: { '小于10%': 2, '10%至25%': 5, '25%至50%': 8, '大于50%': 10 },
      investmentExperience: { '少于2年': 2, '2至5年': 4, '5至10年': 6, '10年以上': 8 },
      investmentAttitude: { '尽可能保证本金安全，不在乎收益率比较低': 2, '追求稳健的收益，可以承担较小的投资风险': 3, '追求较多的收益产生，可以承担较大的投资风险': 5, '希望赚取高回报，愿意为此承担很大的投资风险': 8 },
      investmentDuration: { '1 年以下': 2, '1-3 年': 4, '3-5 年': 6, '5 年以上': 8 },
      investmentChoice: { '全部投资于收益较小且风险较小的A': 2, '同时投资于A和B，但大部分资金投资于收益较小且风险较小的A': 4, '同时投资于A和B，但大部分资金投资于收益较大且风险较大的B': 6, '全部投资于收益较大且风险较大的B': 8 },
      investmentPurpose: { '保本增值': 2, '追求高收益': 8, '两者兼有': 5, '其他': 5 },
      investmentAttitudeWhenFluctuation: { '非常担忧，急于赎回': 2, '稍微担忧，但能接受': 4, '平静对待，相信会回本': 6, '乐观对待，相信会越来越高': 8 },
    };

    const totalScore = Object.keys(values).reduce((acc, key) => acc + (scores[key][values[key]] || 0), 0);
    onScoreChange(totalScore);

    if (totalScore <= 20) {
      message.info(`您的总得分为 ${totalScore}，风险承受能力较低。`);
    } else if (totalScore <= 35) {
      message.info(`您的总得分为 ${totalScore}，风险承受能力中等。`);
    } else if (totalScore <= 50) {
      message.info(`您的总得分为 ${totalScore}，风险承受能力较强。`);
    } else {
      message.info(`您的总得分为 ${totalScore}，风险承受能力很强。`);
    }
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card 
        title="声明"
        style={{ width: '100%' }}
      >
        <Paragraph>
        本问卷旨在协助投资者了解自己的投资状况。通过业内常规方法设计的评估问卷，将根据您提供的资料推论出您的风险属性，作为未来投资本公司产品的参考。请注意，问卷内容及结果不构成对您的要约，DataVest不对问卷的准确性或完整性负责。您应确保在填写问卷时提供的信息真实、准确和可靠。DataVest将根据您的风险等级对投资行为进行检查和提示，但这不构成任何投资建议，也不会对您的投资决策产生实质影响。如因您提供不实信息导致问卷结果与实际情况不符，DataVest将不承担责任。
        </Paragraph>
      </Card>
      <Card title="投资风险偏好评估问卷" style={{ width: '100%' }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="age" label="1、您的年龄介于" rules={[{ required: true, message: '请选择您的年龄' }]}>
            <Radio.Group>
              <Radio value="18-30岁">A 18-30岁</Radio>
              <Radio value="31-50岁">B 31-50岁</Radio>
              <Radio value="51-65岁">C 51-65岁</Radio>
              <Radio value="65岁以上">D 高于65岁</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="income" label="2、您的家庭可支配年收入为（折合人民币）？" rules={[{ required: true, message: '请选择您的家庭可支配年收入' }]}>
            <Radio.Group>
              <Radio value="50万元以下">A 50万元以下</Radio>
              <Radio value="50—100万元">B 50—100万元</Radio>
              <Radio value="100—500万元">C 100—500万元</Radio>
              <Radio value="500万元以上">D 500万元以上</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="assets" label="3、您的家庭总资产中，金融资产（股票、债券、基金等）的投资占比？" rules={[{ required: true, message: '请选择您的家庭总资产占比' }]}>
            <Radio.Group>
              <Radio value="现金及现金等价物占比超过50%">A 现金及现金等价物占比超过50%</Radio>
              <Radio value="股票、债券等金融资产占比超过50%">B 股票、债券等金融资产占比超过50%</Radio>
              <Radio value="房地产等实物资产占比超过50%">C 房地产等实物资产占比超过50%</Radio>
              <Radio value="其他投资（如黄金、艺术品、私募基金等）占比超过50%">D 其他投资（如黄金、艺术品、私募基金等）占比超过50%</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="investmentRatio" label="4、您计划用于金融投资的资产占家庭总资产的比例是多少？" rules={[{ required: true, message: '请选择您的投资比例' }]}>
            <Radio.Group>
              <Radio value="小于10%">A 小于10%</Radio>
              <Radio value="10%至25%">B 10%至25%</Radio>
              <Radio value="25%至50%">C 25%至50%</Radio>
              <Radio value="大于50%">D 大于50%</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="investmentExperience" label="5、您有几年的投资股票、基金、债券等证券的经验？" rules={[{ required: true, message: '请选择您的投资经验' }]}>
            <Radio.Group>
              <Radio value="少于2年">A 少于2年</Radio>
              <Radio value="2至5年">B 2至5年</Radio>
              <Radio value="5至10年">C 5至10年</Radio>
              <Radio value="10年以上">D 10年以上</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="investmentAttitude" label="6、您对投资的态度是？" rules={[{ required: true, message: '请选择您的投资态度' }]}>
            <Radio.Group>
              <Radio value="尽可能保证本金安全，不在乎收益率比较低">A 尽可能保证本金安全，不在乎收益率比较低</Radio>
              <Radio value="追求稳健的收益，可以承担较小的投资风险">B 追求稳健的收益，可以承担较小的投资风险</Radio>
              <Radio value="追求较多的收益产生，可以承担较大的投资风险">C 追求较多的收益产生，可以承担较大的投资风险</Radio>
              <Radio value="希望赚取高回报，愿意为此承担很大的投资风险">D 希望赚取高回报，愿意为此承担很大的投资风险</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="investmentDuration" label="7、您计划的投资期限是多久？" rules={[{ required: true, message: '请选择您的投资期限' }]}>
            <Radio.Group>
              <Radio value="1 年以下">A 1 年以下</Radio>
              <Radio value="1-3 年">B 1-3 年</Radio>
              <Radio value="3-5 年">C 3-5 年</Radio>
              <Radio value="5 年以上">D 5 年以上</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="investmentChoice" label="8、您如何选择投资品种的组合？" rules={[{ required: true, message: '请选择您的投资组合' }]}>
            <Radio.Group>
              <Radio value="全部投资于收益较小且风险较小的A">A 全部投资于收益较小且风险较小的A</Radio>
              <Radio value="同时投资于A和B，但大部分资金投资于收益较小且风险较小的A">B 同时投资于A和B，但大部分资金投资于收益较小且风险较小的A</Radio>
              <Radio value="同时投资于A和B，但大部分资金投资于收益较大且风险较大的B">C 同时投资于A和B，但大部分资金投资于收益较大且风险较大的B</Radio>
              <Radio value="全部投资于收益较大且风险较大的B">D 全部投资于收益较大且风险较大的B</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="investmentPurpose" label="9、您进行证券投资的主要目的？" rules={[{ required: true, message: '请选择您的投资目的' }]}>
            <Radio.Group>
              <Radio value="保本增值">A 保本增值</Radio>
              <Radio value="追求高收益">B 追求高收益</Radio>
              <Radio value="两者兼有">C 两者兼有</Radio>
              <Radio value="其他">D 其他</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="investmentAttitudeWhenFluctuation" label="10、您如何看待投资市场的波动？" rules={[{ required: true, message: '请选择您的态度' }]}>
            <Radio.Group>
              <Radio value="非常担忧，急于赎回">A 非常担忧，急于赎回</Radio>
              <Radio value="稍微担忧，但能接受">B 稍微担忧，但能接受</Radio>
              <Radio value="平静对待，相信会回本">C 平静对待，相信会回本</Radio>
              <Radio value="乐观对待，相信会越来越高">D 乐观对待，相信会越来越高</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );
};

const Questionnaire = () => {
  const [score, setScore] = React.useState(null);

  const handleScoreChange = (newScore) => {
    setScore(newScore);
  };

  return (
    <CustomLayout score={score}>
      <QuestionnaireContent score={score} onScoreChange={handleScoreChange} />
    </CustomLayout>
  );
};

export default Questionnaire;