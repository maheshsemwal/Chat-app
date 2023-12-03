import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const LoadingSpinner = ({size }) => {
  return (
    <BeatLoader
      size={15}
      color={'#36D7B7'}
      loading={true}
      css={override}
    />
  );
};

export default LoadingSpinner;
