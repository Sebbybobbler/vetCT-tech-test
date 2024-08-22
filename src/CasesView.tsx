import { makeApiRequest } from "./services/apiService";
import { useState, useEffect } from "react";
import Row from "./components/Row/Row";
import "./CasesView.css";

export interface CaseObject {
  totalCases: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: [
    {
      id: string;
      creation_date: string;
      case_key: string;
      patient: string;
      status: string;
      specialty: string;
      owner: string;
      reporting_specialist: string;
      species: string;
      body_areas: string;
      turnaround: string;
      reported_date: string;
      image_url: string;
    }
  ];
}

export interface CaseObjectSetter {
  setResponse: null | CaseObject;
}

function CasesView() {
  const [response, setResponse] =
    useState<CaseObjectSetter["setResponse"]>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    async function initialRequest(): Promise<CaseObject> {
      const firstPage: Promise<CaseObject> = await makeApiRequest(
        "?page=1&limit=10"
      );
      setResponse(await firstPage);
      return firstPage;
    }
    initialRequest();
  }, []);

  function searchFilter(response: CaseObject, search: string) {
    const filteredArray = response.data.filter((element) => {
      return element.patient.toLowerCase().includes(search.toLowerCase());
    });
    const filteredBreed = response.data.filter((element) => {
      return element.species.toLowerCase().includes(search.toLowerCase());
    });

    return [...filteredArray, ...filteredBreed];
  }
  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const value: string = e.currentTarget.value;
    setSearch(value);
  }
  async function nextPage(response: CaseObject, setResponse: CaseObject) {
    const currentPage: number = response.currentPage;
    const maxPage = response.totalPages;
    const nextPage: number = currentPage + 1;
    if (nextPage > maxPage) {
      return <></>;
    } else {
      const fetchNextPage: Promise<CaseObject> = await makeApiRequest(
        `?page=${nextPage}&limit=10`
      );
      setResponse(await fetchNextPage);
      return fetchNextPage;
      console.log(response);
    }
  }
  async function prevPage(response: CaseObject, setResponse: CaseObject) {
    const currentPage: number = response.currentPage;
    const prevPage: number = currentPage - 1;
    if (prevPage <= 0) {
      return <></>;
    } else {
      const fetchPrevPage: Promise<CaseObject> = await makeApiRequest(
        `?page=${prevPage}&limit=10`
      );
      setResponse(await fetchPrevPage);
      return fetchPrevPage;
    }
  }

  if (!response) {
    return (
      <>
        <div>
          <p>Loading...</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <input
          type="text"
          placeholder="search"
          onChange={handleChange}
          value={search}
        />
        <table className="casesTable">
          <tbody>
            <tr>
              <th>Case Key</th>
              <th>Name</th>
              <th>Owner</th>
              <th>Specialty</th>
              <th>Date</th>
              <th></th>
            </tr>
            {searchFilter(response, search).map(
              (element: CaseObject["data"][0], index: number) => {
                return <Row key={index} row={element} />;
              }
            )}
          </tbody>
        </table>
        <button onClick={() => prevPage(response, setResponse)}>
          Previous Page
        </button>
        <button onClick={() => nextPage(response, setResponse)}>
          Next Page
        </button>
      </>
    );
  }
}

export default CasesView;
