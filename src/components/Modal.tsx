import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { DialogProps } from "@mui/material/Dialog";

const Modal = ({
  children,
  title,
  open,
  action,
  close,
  props,
}: {
  children: React.ReactNode;
  title: string;
  open: boolean;
  action?: JSX.Element;
  close?: Dispatch<SetStateAction<boolean>>;
  props?: DialogProps["PaperProps"];
}) => {
  return (
    <Dialog open={open} onClose={close} scroll="paper" PaperProps={props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>{action}</DialogActions>
    </Dialog>
  );
};

export default Modal;
