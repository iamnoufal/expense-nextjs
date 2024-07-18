import Image from "next/image";
import { Inter } from "next/font/google";
import { Box, Button, CircularProgress, Container, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import { getAccessToken, getCurrencies, getCustomers, getExpenses, getUsers } from "@/utils/functions";
import { useRouter } from "next/router";
import ExpensesTable from "@/components/ExpensesTable";
import ReportForm from "@/components/ReportForm";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ env }: { env: NodeJS.ProcessEnv }) {
  const router = useRouter()

  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [state, setState] = useState<boolean>(false)

  useEffect(() => {
    if (window) {
      if (localStorage || router.query) {
        if (localStorage.getItem("refresh_token")) {
          setIsAuthenticated(true)
        } else if (router.query.code) {
          localStorage.setItem("refresh_token", router.query.code as string)
          router.push("/")
        } else {
          setIsAuthenticated(false);
        }
        setLoading(false)
      }
    }
  }, [])

  if (loading)
    return <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}><CircularProgress /></Box>;

  if (!isAuthenticated) {
    const { AUTH_URI, CLIENT_ID, REDIRECT_URI } = env;
    return (
      <Container maxWidth="lg" style={{ minHeight: "100vh", width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Button component="a" href={`${AUTH_URI}/auth?scope=ZohoCalendar.calendar.ALL&client_id=${CLIENT_ID}&state=test&response_type=code&redirect_uri=${REDIRECT_URI}&access_type=offline`}>
            Grant Access
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ minHeight: "100vh", width: "100%" }}>
      {/* <ExpenseForm {...{state, setState }} />
      <ReportForm /> */}
      {/* <ExpensesTable {...{state, setState}}  /> */}
      {/* <Button onClick={getAccessToken}>
        Get Access Token
      </Button>
      <Button onClick={getCurrencies}>
        Get Currencies
      </Button>
      <Button onClick={getExpenses}>
        Get Expenses
      </Button>
      <Button onClick={getCustomers}>
        Get Customers
      </Button>
      <Button onClick={getUsers}>
        Get Users
      </Button> */}
    </Container>
  );
}

export const getServerSideProps = async () => {
  return {
    props: {
      env: {
        ...process.env
      },
    },
  };
};
