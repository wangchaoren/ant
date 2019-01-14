import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'components/Login';
import { routerRedux } from 'dva/router';
import styles from './Login.less';
import { getPageQuery } from '../../utils/utils.js';
import ask from '../../utils/ask.js';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    loginError: false,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      // this.props.dispatch({
      //   type: 'login/login',
      //   payload: {
      //     ...values,
      //     type,
      //   },
      // });
      let req = ask('/authorizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: values,
      });
      req.then(res => {
        localStorage.setItem('username', values.email);
        localStorage.setItem('token', res.data.data.token);
        if (localStorage.getItem('token')) {
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          this.props.dispatch(routerRedux.replace(redirect || '/dashboard/analysis'));
        }

      });
      req.catch(error => {
        if (error.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          if (error.response.status === 401) {
            this.setState({ loginError: true });
          }
        } else
          return { code: -1, message: error.toString() };
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  componentDidMount() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };
  handleChange = () => {
    this.setState({ loginError: false });
  }
  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit} onChange={this.handleChange}>
          {/* <Tab key="account" tab="账户密码登录"> */}
            {login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误')}
            <UserName name="email" placeholder="用户名" />
            <Password name="password" placeholder="密码" />
          {/* </Tab> */}
          {/* <Tab key="mobile" tab="手机号登录">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting &&
              this.renderMessage('验证码错误')}
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab> */}
          <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              申请试用
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
          {/* <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div> */}
        </Login>
      </div>
    );
  }
}
