import React,{ useState,useEffect} from 'react';
import axios from "axios";
import { Button, Checkbox, Form, Input, Space, Alert, Row, Col} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useToken  } from '..//../TokenContext';

function Login() {
    useEffect(() => {
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/register_background.svg)`;
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);

    const [loginForm, setLoginForm] = useState({
      user_name:"",
      email: "",
      password: ""
    })

    const Navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const { getToken, setToken, removeToken } = useToken();

    const onFinish = (values) => {
      axios({
          method: "POST",
          url: "/token",
          data: {
              user_name: values.user_name,
              email: values.email,
              password: values.password
          }
      })
      .then((response) => {
          setToken(response.data.access_token);
          console.log(getToken())
          Navigate(`/stock`);
      })
      .catch((error) => {
          if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              console.log(error.response.headers);
              setShowAlert(true);
          }
      });
  };

  const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
  };

  const logMeIn = (event) => {
      event.preventDefault();
      onFinish(loginForm);
  };

    function handleChange(event) { 
      const {value, name} = event.target
      setLoginForm(prevNote => ({
          ...prevNote, [name]: value})
      )}

    const handleBack = () => {
        Navigate('/', { replace: true });
    };

      return (
        <div style={{
        display: 'flex',
        justifyContent: 'flex-start', /* 水平方向从左开始对齐 */
        alignItems: 'flex-end', /* 垂直方向从下开始对齐 */
        position: 'absolute',
        bottom: 200, /* 距离底部0像素 */
        left: 100, /* 距离左侧0像素 */
        height: '100vh', /* 高度为100vh，以覆盖整个视口 */
        }}>
            <Row gutter={16} style={{ width: '100%', maxWidth: 1200 }}>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '1px' }}>
                    <img src="/logo1.png" alt="Welcome" style={{ width: '350px', height: 'auto', objectPosition: 'middle' }} />
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginBottom: '5px' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {showAlert && (
                            <Alert
                                message="Error"
                                description={errorMsg}
                                type="error"
                                showIcon
                                closable
                                onClose={() => setShowAlert(false)}
                            />
                        )}
                        <Form
                            name="login"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Username"
                                name="user_name"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input name="user_name" value={loginForm.user_name} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input name="email" value={loginForm.email} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password name="password" value={loginForm.password} onChange={handleChange} />
                            </Form.Item>

                            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Space size="large">
                                    <Button type="primary" htmlType="submit" onClick={logMeIn}>登录</Button>
                                    <Button type="default" onClick={handleBack}>返回</Button>
                            </Space>
                            </Form.Item>
                        </Form>
                    </Space>
                </Col>
            </Row>
        </div>
    );

}

export default Login;