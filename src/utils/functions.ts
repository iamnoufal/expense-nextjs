import { setCookie } from "./cookie";

const getResp = (uri : string) => {
  return fetch(uri)
    .then(res => {
      if (res.status != 200) 
        return null;
      else 
        return res;
    })
}

export const getExpenses = async () => {
  let resp = await getResp("http://127.0.0.1:3000/api/expense");
  if (resp == null) 
    resp = await getAccessToken().then(() => getResp("http://127.0.0.1:3000/api/expense")); 
  let data = await resp?.json();
  return data;
}

export const getCustomers = async () => {
  let resp = await fetch("http://127.0.0.1:3000/api/customers");
  if (resp.status != 200) 
    resp = await getAccessToken().then(() => getCustomers());
  let data = await resp.json();
  console.log(data)
  return data;
}

export const getCategories = async () => {
  let resp = await getResp("http://127.0.0.1:3000/api/categories")
  if (resp == null) 
    resp = await getAccessToken().then(() => getResp("http://127.0.0.1:3000/api/categories")); 
  let data = await resp?.json();
  return data;
}

export const getUsers = async () => {
  let resp = await fetch("http://127.0.0.1:3000/api/users");
  if (resp.status != 200) 
    resp = await getAccessToken().then(() => getUsers());
  let data = await resp.json();
  console.log(data)
  return data;
}

export const getCurrencies = async () => {
  let resp = await fetch("http://127.0.0.1:3000/api/currencies");
  if (resp.status != 200) 
    resp = await getAccessToken().then(() => getCurrencies());
  let data = await resp.json();
  console.log(data)
  return data
};

export const getAccessToken = async () => {
  const res = await fetch("http://127.0.0.1:3000/api/auth/token");
  console.log(res)
  const token = await res.text();
  console.log(token.slice(1, -1));
  setCookie("access_token", token.slice(1, -1));
};