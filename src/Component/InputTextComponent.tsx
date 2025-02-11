 
import React, { ChangeEvent } from 'react';
import { FC } from "react";

interface InputClickProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const InputClick: FC<InputClickProps> = ({ value, onChange, placeholder, ...props }) => {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  )
}

export default InputClick;
