export interface BaseProps {
  children?: React.ReactNode | string;
  className?: string;
  onClick?: () => void;
}

export interface SignInFormInput {
  username: string;
  password: string;
}

