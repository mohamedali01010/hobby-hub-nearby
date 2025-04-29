
import _ from 'lodash';

export const logButtonClick = () => {
  const message = _.upperFirst('button clicked');
  console.log(message);
};
