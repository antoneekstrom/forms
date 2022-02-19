import React, { useEffect, useState } from "react";
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
  const [{ data, fetching, error }] = useQuery({ query: GET_FORMS });
  if (error) {
    console.log(error);
    return <h1>{error.message}</h1>;
  }

  if (fetching) {
    return <h1>loading..</h1>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
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
  const [user, setUser] = useState(null);

  if (!user) {
    return <p>not logged in</p>;
  } else {
    console.log(user);
    return <p>logged in as {user.cid}</p>;
  }
}

export default function Test() {
  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <AddFormButton />
      <UserStatus />
      <Forms />
    </div>
  );
}
