// App.js
import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Link} from 'react-router-dom';
import { Button, Flex, Typography ,Space} from 'antd';
import Register from './components/register/Register';

import Login from './components/login/Login';

import Stock from './stock/stock';
import User from './user/user';
import AboutUs from './us/us';
import Questionnaire from './us/questionnaire';
import Backtest from './backtest/backtest';
import Manual from './backtest/manual'
import News from './news/news';
import { TokenProvider } from './TokenContext';
import Asset from './user/asset';
import Record from './record/record'
import './App.css'

const { Title } = Typography;

function Home({ handleButtonClick, showButtons }) {
  return (
    <Flex justify="flex-end" align="flex-end" style={{ position: 'absolute', bottom: 210, left: 180}}>
      {showButtons && (
        <Space direction="vertical" size="large" style={{ maxWidth: '300px' }}>
          <Link to="/register">
            <Button type="primary" size="large" block style={{ width: '300px' }} ghost onClick={handleButtonClick}>
              立即注册
            </Button>
          </Link>
        <Space size="large" />
          <Link to="/login">
            <Button type="primary" size="large" block ghost onClick={handleButtonClick}>
              用户登录
            </Button>
          </Link>
        </Space>
      )}
    </Flex>
  );
}

function App() {
  const [showButtons, setShowButtons] = useState(true);

  const handleButtonClick = () => {
    setShowButtons(false);
  }; 

 return (
  <TokenProvider>
  <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<Home handleButtonClick={handleButtonClick} showButtons={showButtons} />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login  />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/user" element={<User />} />
        <Route path="/asset" element={<Asset />} />
        <Route path="/us" element={<AboutUs />} />
        <Route path="/record" element={<Record />} />
        <Route path="/backtest" element={<Backtest />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/news" element={<News />} /> 
      </Routes>
    </div>
  </BrowserRouter>
  </TokenProvider>
  
    
 );
}

export default App;




