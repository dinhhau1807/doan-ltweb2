import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row, Spin, message, Button, Input, Form, Descriptions } from 'antd';

//Actions
import { getIdentity, approveIdentity } from '../../actions/StaffActions';

// Constants
import { DATE_FORMAT } from '../../constants/GlobalConstants';

// Utils
import { getErrorMessage } from '../../utils/helpers';

// Styles
import './IdentityDetails.scss';

const propTypes = {
  match: PropTypes.object
};

const defaultProps = {};

const IdentityDetails = ({ match }) => {
  const [identity, setIdentity] = useState({});
  const [loading, setLoading] = useState(false);
  const [frontImageBase64, setFrontImageBase64] = useState(null);
  const [backImageBase64, setBackImageBase64] = useState(null);
  const [approved, setApproved] = useState(false);

  //fetch identity
  useEffect(() => {
    setLoading(true);
    const fetchIdentity = async id => {
      try {
        const { data } = await getIdentity(id);

        setIdentity(data);
      } catch (err) {
        message.error(getErrorMessage(err));
      }
      setLoading(false);
    };

    if (match && match.params && match.params.id) {
      const { id } = match.params;
      fetchIdentity(id);
    }
  }, [match]);

  useEffect(() => {
    const { frontImage, backImage, staffIdApproved } = identity;
    //convert buffer to image with identity is not null
    if (frontImage && backImage) {
      const { data: front } = frontImage;
      const { data: back } = backImage;

      function toImage(buffer) {
        let TYPED_ARRAY = new Uint8Array(buffer);
        const STRING_CHAR = TYPED_ARRAY.reduce((result, byte) => {
          return result + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR);

        return 'data:image/jpg;base64,' + base64String;
      }

      setFrontImageBase64(toImage(front));
      setBackImageBase64(toImage(back));
    }

    //disabled approve button
    setApproved(staffIdApproved !== null);
  }, [identity]);

  const onFinish = async values => {
    if (!approved) {
      try {
        setLoading(true);

        const { customerId } = identity;
        const { amount } = values;
        const data = await approveIdentity({
          idCustomer: +customerId,
          amount: +amount
        });

        setApproved(true);

        message.success(data.message);
      } catch (err) {
        message.error(getErrorMessage(err));
      }
      setLoading(false);
    }
  };

  const { id, identityNumber, registrationDate } = identity;
  const issuedOn = moment(registrationDate).format(DATE_FORMAT);

  return (
    <div className="identity">
      <h2 className="page-header">IDENTITY DETAILS</h2>
      <Spin spinning={loading}>
        <Descriptions
          bordered
          layout="vertical"
          column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="ID">{id}</Descriptions.Item>
          <Descriptions.Item label="Identication number">
            {identityNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Issued on">{issuedOn}</Descriptions.Item>
          <Descriptions.Item label="Front image">
            <img
              className="identity__photo"
              src={frontImageBase64}
              alt="front"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Back image">
            <img className="identity__photo" src={backImageBase64} alt="back" />
          </Descriptions.Item>
        </Descriptions>
        <Row>
          <Form style={{ margin: '10px 0' }} onFinish={onFinish}>
            <Form.Item
              name="amount"
              label="Amount"
              rules={[{ required: true, message: 'Amount is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                disabled={approved}
                loading={loading}
                htmlType="submit"
                type="primary"
              >
                {approved ? 'Approved' : 'Approve'}
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </Spin>
    </div>
  );
};

IdentityDetails.propTypes = propTypes;
IdentityDetails.defaultProps = defaultProps;

export default IdentityDetails;
