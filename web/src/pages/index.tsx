import { useEffect, useState } from "react";

import Head from "next/head";
import { Inter } from "next/font/google";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

import Table from "react-bootstrap/Table";
import { Alert, Container, Button } from "react-bootstrap";

import { FaAngleDoubleLeft, FaAngleLeft, FaAngleDoubleRight, FaAngleRight } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  data: { users: TUserItem[]; totalPages: number };
};

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch("http://localhost:8000/users", { method: "GET" });
    if (!res.ok) {
      return { props: { statusCode: res.status, data: { users: [], totalPages: 0 } } };
    }

    return {
      props: { statusCode: 200, data: await res.json() },
    };
  } catch (e) {
    return { props: { statusCode: 500, data: { users: [], totalPages: 0 } } };
  }
}) satisfies GetServerSideProps<TGetServerSideProps>;

export default function Home({ statusCode, data }: TGetServerSideProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentGroup, setCurrentGroup] = useState(1);
  const [content, setContent] = useState(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:8000/users?page=${currentPage}`, { method: "GET" });
        if (res.ok) {
          const newData = await res.json();
          setContent(newData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [currentPage]);

  const { users, totalPages } = content;
  console.log(data);

  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  // pagination
  const goToNextPage = () => {
    const nextPage = Math.min(currentPage + 1, totalPages);
    setCurrentPage(nextPage);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // group buttons
  const pagesPerGroup = 10;

  const startPage = (currentGroup - 1) * pagesPerGroup + 1;

  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);

  // pagination

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/*TODO add pagination*/}
          <div className="d-flex gap-1 justify-content-center">
            <Button onClick={goToPrevPage} disabled={currentPage === 1} variant="outline-primary">
              <FaAngleDoubleLeft />
            </Button>
            <Button
              onClick={() => setCurrentGroup((prevGroup) => Math.max(prevGroup - 1, 1))}
              disabled={currentGroup === 1}
              variant="outline-primary"
            >
              <FaAngleLeft />
            </Button>
            {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
              const pageNumber = startPage + index;
              return (
                <Button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  variant={pageNumber === currentPage ? "primary" : "outline-primary"}
                >
                  {pageNumber}
                </Button>
              );
            })}

            <Button
              onClick={() =>
                setCurrentGroup((prevGroup) => Math.min(prevGroup + 1, Math.ceil(totalPages / pagesPerGroup)))
              }
              disabled={currentGroup === Math.ceil(totalPages / pagesPerGroup)}
              variant="outline-primary"
            >
              <FaAngleRight />
            </Button>
            <Button onClick={goToNextPage} disabled={currentPage === totalPages} variant="outline-primary">
              <FaAngleDoubleRight />
            </Button>
          </div>
        </Container>
      </main>
    </>
  );
}
