import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  Dispatch,
  Fragment,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { getCategories } from "@/utils/functions";
import Modal from "./Modal";

const ExpenseForm = ({
  state,
  setState,
}: {
  state: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [lineItems, setLineItems] = useState<
    { category_id: string; description: string; amount: number }[]
  >([{ category_id: "", description: "", amount: NaN }]);
  const [open, setOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactElement>(<Box></Box>);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handling submission");
    let formData = new FormData(event.currentTarget);
    let data = Object.fromEntries((formData as any).entries());
    data.currency_id = "1687244000000000064";
    data.is_reimbursable = data.is_reimbursable === "on";
    data.line_items = lineItems;
    console.log(data);
    const resp = await fetch("http://127.0.0.1:3000/api/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const res = await resp.json();
    console.log(res);
    console.log(lineItems);
    setLineItems([{ category_id: "", description: "", amount: NaN }]);
    setModalContent(
      <Box>
        <Typography variant="body1">Expense ID: {res.expense_id}</Typography>
        <Typography variant="body1">
          Merchant Name: {res.merchant_name}
        </Typography>
        <Typography variant="body1">Amount: {res.amount}</Typography>
        <Typography variant="body1">
          Date: {res.created_time.split("T")[0]}
        </Typography>
        <Typography variant="body1">Status: {res.receipt_status}</Typography>
      </Box>
    );
    setOpen(true);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    let imageFile = e.currentTarget.files![0];
    const reader = new FileReader();
    reader.onloadend = () => {
      fetch("http://127.0.0.1:3000/api/expense/receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt: reader.result }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          let d = data.expenses[0];
          setModalContent(
            <Box>
              <img src={reader.result as string} style={{ width: "100%" }} />
              <Typography variant="body1">
                Expense ID: {d.expense_id}
              </Typography>
              <Typography variant="body1">
                Date: {d.created_time.split("T")[0]}
              </Typography>
              <Typography variant="body1">
                Status: {d.receipt_status}
              </Typography>
            </Box>
          );
          setOpen(true);
        });
    };
    reader.readAsDataURL(imageFile);
  }

  return (
    <Container
      maxWidth="lg"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Button
          variant="contained"
          onClick={() => document.getElementById("receipt_upload")?.click()}
        >
          Upload receipt
          <input
            type="file"
            accept="image/jpeg"
            style={{ display: "none" }}
            id="receipt_upload"
            onChange={handleReceiptUpload}
          />
        </Button>
        <Typography variant="body2" sx={{ my: 2 }}>
          OR
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="dense">
            <TextField label="Merchant Name" name="merchant_name" fullWidth />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <TextField
              label="Date"
              name="date"
              fullWidth
              required
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </FormControl>
          <FormControlLabel
            name="is_reimbursable"
            control={<Switch />}
            label="Reimbursable"
          />
          {lineItems.map((_, index) => (
            <Fragment key={index}>
              {lineItems.length > 1 && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">Item {index + 1}</Typography>
                  <Button
                    variant="text"
                    onClick={() =>
                      setLineItems(lineItems.filter((_, i) => i !== index))
                    }
                  >
                    Remove
                  </Button>
                </Box>
              )}
              <FormControl fullWidth margin="dense" required>
                <InputLabel>Category</InputLabel>
                <Select
                  defaultValue={""}
                  label="Category"
                  value={_.category_id}
                  onChange={(e) =>
                    setLineItems(
                      lineItems.map((l, i) => {
                        if (i == index) {
                          return { ...l, category_id: e.target.value };
                        } else {
                          return l;
                        }
                      })
                    )
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.category_id} value={c.category_id}>
                      {c.category_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <TextField
                  label="Description"
                  fullWidth
                  required
                  value={_.description}
                  onChange={(e) =>
                    setLineItems(
                      lineItems.map((l, i) => {
                        if (i == index) {
                          return { ...l, description: e.target.value };
                        } else {
                          return l;
                        }
                      })
                    )
                  }
                />
              </FormControl>
              <FormControl fullWidth margin="dense">
                <TextField
                  label="Amount"
                  fullWidth
                  required
                  type="number"
                  onChange={(e) =>
                    setLineItems(
                      lineItems.map((l, i) => {
                        if (i == index) {
                          return { ...l, amount: parseInt(e.target.value) };
                        } else {
                          return l;
                        }
                      })
                    )
                  }
                />
              </FormControl>
            </Fragment>
          ))}
          <Button
            variant="text"
            onClick={() =>
              setLineItems([
                ...lineItems,
                { category_id: "", description: "", amount: NaN },
              ])
            }
          >
            Itemize
          </Button>
          <Box sx={{ my: 2 }}>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </form>
      </Box>
      <Modal
        title="Successfully created!"
        open={open}
        action={<Button onClick={() => setOpen(false)}>Ok</Button>}
        close={() => setOpen(false)}
      >
        {modalContent}
      </Modal>
    </Container>
  );
};

export default ExpenseForm;
