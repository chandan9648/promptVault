
import React from 'react';
import { useAuth } from './useAuth';

const Protected = ({ children }) => {
  const { user } = useAuth();
  return user ? children : null;
};

export default Protected;
