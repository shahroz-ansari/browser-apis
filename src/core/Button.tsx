import { FC } from 'react';

const Button:FC<Props> = ({ children, ...rest }) => (
  <button
    type="button"
    className="border-blue-800 bg-blue-600 text-white px-4 py-1 hover:bg-blue-700"
    {...rest}
  >
    {children}
  </button>
);

interface Props {
    [restProps:string]: unknown;
}
export default Button;
