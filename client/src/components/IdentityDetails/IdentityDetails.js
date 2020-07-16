import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row, Col, Typography, Spin, message, Button } from 'antd';
import { getErrorMessage } from '../../utils/helpers';
import { DATE_FORMAT } from '../../constants/GlobalConstants';

import './IdentityDetails.scss';

const { Paragraph } = Typography;

const propTypes = {
  getIdentity: PropTypes.func.isRequired,
  approveIdentity: PropTypes.func.isRequired,
  props: PropTypes.object
};

const defaultProps = {};

const IdentityDetails = ({ getIdentity, approveIdentity, match }) => {
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

  const onHandleApprove = (id, approved) => async () => {
    if (!approved) {
      try {
        setLoading(true);

        const data = await approveIdentity({ idCustomer: +id });

        setApproved(true);

        message.success(data.message);
      } catch (err) {
        message.error(getErrorMessage(err));
      }
      setLoading(false);
    }
  };

  const { id, customerId, identityNumber, registrationDate } = identity;

  return (
    <div>
      <Spin spinning={loading}>
        <Row gutter={16}>
          <Col>
            <Row>
              <Paragraph>
                <strong>Mã xác nhận:</strong>{' '}
              </Paragraph>{' '}
              <Paragraph>{id}</Paragraph>
            </Row>
          </Col>
          <Col>
            <Row>
              <Paragraph>
                <strong>Số CMND:</strong>{' '}
              </Paragraph>{' '}
              <Paragraph>{identityNumber}</Paragraph>
            </Row>
          </Col>
          <Col>
            <Row>
              <Paragraph>
                <strong>Ngày đăng kí:</strong>{' '}
              </Paragraph>{' '}
              <Paragraph>
                {moment(registrationDate).format(DATE_FORMAT)}
              </Paragraph>
            </Row>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <img
              style={{ objectFit: 'cover' }}
              src={frontImageBase64}
              alt="front"
            />
          </Col>
          <Col>
            <img
              style={{ objectFit: 'cover' }}
              src={backImageBase64}
              alt="back"
            />
          </Col>
        </Row>
        <Row>
          <Button
            disabled={approved}
            loading={loading}
            onClick={onHandleApprove(customerId, approved)}
            style={{ marginTop: '10px' }}
            type="primary"
          >
            {approved ? 'Đã xác nhận' : 'Xác nhận'}
          </Button>
        </Row>
      </Spin>
    </div>
  );
};

IdentityDetails.propTypes = propTypes;
IdentityDetails.defaultProps = defaultProps;

export default IdentityDetails;
