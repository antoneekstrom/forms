import {
  gql,
  useMutation,
  useQuery,
} from "@apollo/client";
import React, { useState } from "react";

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
  const { loading, error, data } = useQuery(GET_FORMS);
  if (error) {
    console.log(error);
    return <h1>{error.message}</h1>;
  }

  if (loading) {
    return <h1>loading..</h1>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

function AddFormButton() {
  const [formTitle, setFormTitle] = useState("");
  const [addForm] = useMutation(ADD_FORM, {
    update(cache, { data: { addForm } }) {
      cache.modify({
        fields: {
          forms(existingForms = []) {
            const newFormRef = cache.writeFragment({
              data: addForm,
              fragment: gql`
                fragment NewForm on Form {
                  title
                }
              `,
            });
            return [...existingForms, newFormRef];
          },
        },
      });
    },
  });

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

export default function Test() {
  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <Forms />
    </div>
  );
}
