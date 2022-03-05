import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { gql, useMutation, useQuery } from "urql";

const GET_FORMS = gql`
  query {
    forms {
      title
    }
  }
`;

const ADD_FORM = gql`
  mutation AddForm($title: String!) {
    addForm(data: { title: $title }) {
      title
    }
  }
`;

function LoginButton() {
  return (
    <button
      onClick={() => {
        window.location.href = "http://localhost:3000/api/auth/login";
      }}>
      login
    </button>
  );
}

function LogoutButton() {
  return (
    <button
      onClick={() => {
        window.location.href = "http://localhost:3000/api/auth/logout";
      }}>
      logout
    </button>
  );
}

function Forms() {
  const [{ data, fetching, error }, refetch] = useQuery({ query: GET_FORMS });

  // refetch forms on interval
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch({ requestPolicy: "network-only" });
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [refetch]);

  if (error) {
    console.log(error);
    return <h1>{error.message}</h1>;
  }

  if (fetching) { 
    return <h1>loading..</h1>;
  }
  
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold">Forms</h1>
      <ol className="list-none flex flex-col gap-6 mt-2">
        {data.forms.map((form) => (
          <li key={form.title}>
            <div className="p-6 rounded-md shadow-md bg-white max-w-screen-md">
              <h1>{form.title}</h1>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function AddFormButton() {
  const [formTitle, setFormTitle] = useState("");
  const [, addForm] = useMutation(ADD_FORM);

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setFormTitle(e.target.value)}
        value={formTitle}
      />
      <button onClick={() => addForm({ variables: { title: formTitle } })}>
        add form
      </button>
    </div>
  );
}

function UserStatus() {
  const { data: user, error } = useSWR(
    "http://localhost:3000/api/user",
    async (url) => {
      const result = await fetch(url, {
        credentials: "include",
      });

      try {
        return await result.json();
      } catch (e) {
        return;
      }
    }
  );

  if (error) {
    console.error(error);
    return <p>{error.message}</p>;
  }

  if (!user) {
    return <p>not logged in</p>;
  } else {
    return <p>logged in as {user.cid}</p>;
  }
}

export default function Test() {
  return (
    <div className="p-8">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <LoginButton />
          <LogoutButton />
        </div>
        <AddFormButton />
        <UserStatus />
      </div>
      <Forms />
    </div>
  );
}
