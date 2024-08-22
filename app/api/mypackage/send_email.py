import smtplib
import random
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# 发送邮箱的函数
# 输入str类型的邮箱，返回str类型的验证码，但是请注意你需要修改你的邮箱和密钥（请注意密钥不是你的QQ密码）
def send_verification_email(email):
    
    verification_code = ''.join(random.choices('0123456789', k=6))

    smtp_server = 'smtp.qq.com'
    smtp_port = 587
    # 这个请更改为你的邮箱和密码,登录QQ邮箱点击设置，账号后应该有
    # 重要
    sender_email = '836011345@qq.com'
    sender_password = ''  

    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = email
    message['Subject'] = '邮箱验证'

    body = f'您的验证码是：{verification_code}'
    message.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email, message.as_string())
        print('邮件发送成功！')
    except Exception as e:
        print('邮件发送失败:', e)
    finally:
        server.quit()

    return verification_code


