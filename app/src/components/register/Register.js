import { useState , useEffect} from 'react';
import axios from "axios";
import { Button, Form, Flex, Input, Alert, Space, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { useToken  } from '..//../TokenContext';

function Register() {

    useEffect(() => {
    // 设置背景样式
    document.body.style.backgroundImage = `url(${process.env.PUBLIC_URL}/register_background.svg)`;
    // 组件卸载时清理样式
    return () => {
        document.body.style.backgroundImage = '';
    };
  }, []);

    // 初始化用户的email，user_name,password
    const [RegisterForm, setRegisterForm] = useState({
      email: "",
      user_name:"",
      password: ""
    })

    // 初始化正确的验证码（也就是服务器得到的）
    const [correctVerificationCode, setCorrectVerificationCode] = useState('');
    // 初始化用户输入的验证码
    const [verificationCode, setVerificationCode] = useState('');
    
    const [emailError, setEmailError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const { getToken, setToken, removeToken } = useToken();

    const Navigate=useNavigate();

    // 用GPT写的一个可以验证email格式的正则表达式。（要求符合真正的邮箱格式）
    const isEmailValid = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
      return emailRegex.test(email);
  };

    // 当点击 “获取验证码” 按钮时，执行
    const onClickVertify = (values) => {  
      axios({
        method: "POST",
        url:"/yanzheng",
        data:{
          user_name:RegisterForm.user_name,
          email: RegisterForm.email,
          password: RegisterForm.password
         }
      })
      .then((response) => {
        if (response) {
          console.log(response);
          setCorrectVerificationCode(response.data.verificationcode);
      } else {
          console.log("Unknown response from server");
      }
      }).catch((error) => {
        if (error.response.data.msg === "already registered") {
            setErrorMsg("该邮箱已被注册");
            // 可以在页面中显示提示信息，或者执行其他操作
            setShowAlert(true);
        }
        else {
          setErrorMsg('注册失败，请稍后再试');
          setShowAlert(true);
          }
      })
    }

    // 点击“注册”按钮后执行
    const onFinish = (event) => {
      event.preventDefault();
      if (correctVerificationCode === verificationCode) {
          axios({
              method: "POST",
              url: "/insert_data",
              data: {
                  user_name: RegisterForm.user_name,
                  email: RegisterForm.email,
                  password: RegisterForm.password
              }
          })
          .then((response) => {
              if (response.data.msg === 'successful') {
                  console.log(response);
                  setToken(response.data.access_token);
                  Navigate(`/stock`);
              } else {
                  console.log("Unknown response from server");
              }
          })
          .catch((error) => {
              setErrorMsg('something erred');
          });
      } else {
          setErrorMsg('Verification code incorrect');
          setShowAlert(true);
      }
  };

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo);
    };

    function handleChange(event) { 
      const {value, name} = event.target;
      console.log(name, value); // 调试日志
      setRegisterForm(prevNote => ({
          ...prevNote, [name]: value
      }));
    }
    
    // 点击“返回”按钮，返回根路径
    const handleBack = () => {
      Navigate('/');
  };

    // “注册”按钮只有在此函数返回True时，才会变亮（需要四个框框都填入内容）
    function isFormValid() {
      return isEmailValid(RegisterForm.email) && RegisterForm.user_name && RegisterForm.password && verificationCode;
    }
    
    // “获取验证码”按钮只有在此函数返回True时，才会变亮（需要前三个框框都填入内容）
    function isButtonVerifyValid() {
      return isEmailValid(RegisterForm.email) && RegisterForm.user_name && RegisterForm.password
    }

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
            <img src="/logo1.png" alt="Welcome" style={{ width: '350px', height: 'auto', objectPosition: 'top' }} />
          </Col>
          <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginBottom: '5px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {emailError && (
                <Alert
                  message="请输入标准的email格式"
                  type="warning"
                  showIcon
                  closable
                  onClose={() => setEmailError(false)}
                />
              )}
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
                name="register"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  {/* <Input name="email" value={RegisterForm.email} onChange={handleChange} onBlur={handleEmailBlur} /> */}
                  <Input name="email" value={RegisterForm.email} onChange={handleChange}  />
                </Form.Item>

                <Form.Item
                  label="Username"
                  name="user_name"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                >
                  <Input name="user_name" value={RegisterForm.user_name} onChange={handleChange} />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input.Password name="password" value={RegisterForm.password} onChange={handleChange} />
                </Form.Item>

                <Form.Item
                  label="Verification Code"
                  name="verification_code"
                  rules={[{ required: true, message: 'Please input the verification code!' }]}
                >
                  <Flex wrap gap="small" className="site-button-ghost-wrapper">
                    <Input name="verification_code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                    <Button type="primary" ghost onClick={onClickVertify} disabled={!isButtonVerifyValid()} >获取验证码</Button>
                  </Flex>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                  <Space size="large">
                      <Button type="primary" htmlType="submit" onClick={onFinish} disabled={!isFormValid()}>注册</Button>
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
  export default Register;
