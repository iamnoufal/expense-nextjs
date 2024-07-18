import { getExpenses } from "@/utils/functions";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import Modal from "./Modal";

const ReportForm = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedExpenses, setSelectedExpenses] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    getExpenses().then((data) =>
      setExpenses(data.filter((expense: any) => expense.report_id == ""))
    );
  }, []);

  const handleSelectionChange = (expense: any) => {
    if (selectedExpenses?.indexOf(expense) == -1) {
      setSelectedExpenses([...selectedExpenses, expense]);
    } else {
      setSelectedExpenses(selectedExpenses.filter((e: any) => e != expense));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let formData = new FormData(event.currentTarget);
    let data = Object.fromEntries((formData as any).entries());
    data.expenses = selectedExpenses.map(e => ({ expense_id: e.expense_id }));
    fetch("http://127.0.0.1:3000/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(res => res.json()).then(res => alert(res.message));
  }

  return (
    <Fragment>
      <Button sx={{position: "fixed", right: 20, bottom: 20, borderRadius: 50}} variant="contained" onClick={() => setOpen(true)}>New Report</Button>
      <Modal
        open={open}
        title="New Report"
        action={<Button type="submit">Create</Button>}
        close={() => setOpen(false)}
        props={{
          component: "form",
          onSubmit: handleSubmit,
          sx: { width: "600px" },
        }}
      >
        <Box>
          <FormControl fullWidth margin="dense">
            <TextField label="Report Name" name="report_name" fullWidth required />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <TextField label="Description" name="description" fullWidth required />
          </FormControl>
          <FormGroup>
            <Typography>Select Expenses</Typography>
            {expenses.map((expense: any) => (
              <FormControlLabel
                key={expense.expense_id}
                control={
                  <Checkbox
                    checked={selectedExpenses?.indexOf(expense) != -1}
                    onChange={() => handleSelectionChange(expense)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
                label={
                  <Box>
                    <Typography>{expense.date}</Typography>
                    <Typography>
                      {expense.currency_symbol}
                      {expense.total}
                    </Typography>
                  </Box>
                }
              />
            ))}
          </FormGroup>
        </Box>
      </Modal>
    </Fragment>
  );
};

export default ReportForm;
