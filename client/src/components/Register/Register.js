import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LOGIN_URL, TOKEN_KEY } from '../../constants/GlobalConstants';
import {
  createCookie,
  getBase64,
  getErrorMessage,
  b64toBlob
} from '../../utils/helpers';

import './Register.scss';
import {
  Form,
  Input,
  Button,
  DatePicker,
  Row,
  Col,
  Upload,
  Modal,
  message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label} không được bỏ trống!',
  types: {
    // eslint-disable-next-line no-template-curly-in-string
    email: '${label} không đúng định dạng!'
  }
};

const propTypes = {
  register: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const defaultProps = {};

const Register = ({ register, history }) => {
  const [loading, setLoading] = useState(false);
  //upload state
  const [uploadState, setUploadState] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: []
  });

  const handleImageCancel = () => {
    setUploadState(prevState => ({ ...prevState, previewVisible: false }));
  };

  const handleImagePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setUploadState(prevState => ({
      ...prevState,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    }));
  };

  const handleImagesChange = ({ fileList }) => {
    setUploadState(prevState => ({ ...prevState, fileList }));
  };

  const onFinish = async values => {
    try {
      setLoading(true);

      const {
        username,
        email,
        password,
        name,
        DoB,
        phone,
        address,
        identityNumber,
        registrationDate
      } = values;

      const body = {
        username,
        email,
        password,
        name,
        dateOfBirth: DoB.format('yyyy/MM/DD'),
        phoneNumber: phone,
        address,
        identityNumber,
        registrationDate: registrationDate.format('yyyy/MM/DD')
      };

      //parse body to formData
      const formData = new FormData();
      for (const key in body) {
        formData.append(key, body[key]);
      }

      //parse base64 to blob
      const { fileList } = uploadState;
      const propsName = ['frontImage', 'backImage'];
      for (let i = 0; i < fileList.length; i++) {
        const block = fileList[i].thumbUrl.split(';');
        // Get the content type of the image
        const contentType = block[0].split(':')[1]; // In this case "image/jpeg..."
        // get the real base64 content of the file
        const realData = block[1].split(',')[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."
        // Convert it to a blob to upload
        const blob = b64toBlob(realData, contentType);

        formData.append(propsName[i], blob);
      }

      const { token } = await register(formData);
      createCookie(TOKEN_KEY, token);
      history.push('/');
    } catch (err) {
      message.error(getErrorMessage(err), 10);
      setLoading(false);
    }
  };

  const { previewVisible, previewImage, fileList, previewTitle } = uploadState;
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <div className="public-form">
      <div className="public-form__wrap">
        <h2 className="public-form__header">Đăng kí tài khoản</h2>
        <Form
          {...layout}
          name="form"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true }]}
              >
                <Input type="password" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                dependencies={['password']}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        'Xác nhận mật khẩu không chính xác!'
                      );
                    }
                  })
                ]}
              >
                <Input type="password" />
              </Form.Item>
              <Form.Item
                name="name"
                label="Họ tên"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="DoB"
                label="Ngày sinh"
                rules={[{ required: true }]}
              >
                <DatePicker format="DD-MM-yyyy" placeholder="" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="identityNumber"
                label="Số CMND"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="registrationDate"
                label="Ngày cấp CMND"
                rules={[{ required: true }]}
              >
                <DatePicker format="DD-MM-yyyy" placeholder="" />
              </Form.Item>
              <Form.Item
                name="photos"
                label="Ảnh chứng minh"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (fileList.length !== 2) {
                        return Promise.reject(
                          'Ảnh chứng minh phải có đủ 2 mặt'
                        );
                      }

                      const fileSplit = value ? value.split('.') : [];
                      if (fileSplit.length > 0) {
                        const ext = fileSplit[fileSplit.length - 1];
                        if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          'Không đúng định dạng (jpg, jpeg, png)'
                        );
                      }
                    }
                  })
                ]}
              >
                <div className="clearfix">
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handleImagePreview}
                    onChange={handleImagesChange}
                    beforeUpload={() => false}
                  >
                    {fileList.length === 2 ? null : uploadButton}
                  </Upload>
                  <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleImageCancel}
                  >
                    <img
                      alt="photos"
                      style={{ width: '100%' }}
                      src={previewImage}
                    />
                  </Modal>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button loading={loading} type="primary" htmlType="submit">
                  Đăng kí
                </Button>
                <a href={LOGIN_URL} style={{ marginLeft: '10px' }}>
                  Trở về đăng nhập
                </a>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

Register.propTypes = propTypes;
Register.defaultProps = defaultProps;

export default Register;