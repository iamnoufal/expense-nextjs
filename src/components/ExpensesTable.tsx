import { getExpenses } from "@/utils/functions";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";

const ExpensesTable = ({ state, setState }: {state: boolean, setState: Dispatch<SetStateAction<boolean>>}) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  useEffect(() => {
    getExpenses().then((data) => setExpenses(data));
  }, [state]);

  const Row = ({ expense }: { expense: any }) => {
    const [open, setOpen] = useState(false);
    console.log(expense);
    return (
      <Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          {/* <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? "-" : "+"}
            </IconButton>
          </TableCell> */}
          <TableCell align="right">{expense.date}</TableCell>
          <TableCell align="right">{expense.merchant_name}</TableCell>
          <TableCell align="right">{expense.total}</TableCell>
        </TableRow>
        {/* <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Total price ($)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expense.line_items.map((item: any) => (
                      <TableRow key={item.line_item_id}>
                        <TableCell align="right">
                          {item.category_name}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{item.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow> */}
      </Fragment>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {/* <TableCell /> */}
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Merchant Name</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense) => (
            <Row key={expense.expense_id} expense={expense} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpensesTable;
