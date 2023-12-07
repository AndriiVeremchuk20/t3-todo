import { type FC, type ReactNode } from "react";

interface PropsModal {
  children: ReactNode;
}

const Modal: FC<PropsModal> = ({ children }) => {
  return (
    <div className="fixed left-0 top-0 flex h-screen w-screen items-center justify-center bg-neutral-600 bg-opacity-70">
      {children}
    </div>
  );
};

export default Modal;
