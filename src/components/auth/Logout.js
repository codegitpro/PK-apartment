import React, { useEffect } from 'react';
import { logout } from '../../services';

export default function Logout({ history }) {
  useEffect(() => {
    logout();
    history.push('/login');
  });

  return (
    <div></div>
  );
}
