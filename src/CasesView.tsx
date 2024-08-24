import { makeApiRequest } from "./services/apiService";
import { useState, useEffect } from "react";
import Row from "./components/Row/Row";
import "./CasesView.css";

export type CaseObject = {
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
};

function CasesView() {
  const [response, setResponse] = useState<CaseObject | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [allCases, setAllCases] = useState<CaseObject | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [totalCases, setTotalCases] = useState(0);

  useEffect(() => {
    async function initialRequest(): Promise<CaseObject> {
      const firstPage: Promise<CaseObject> = await makeApiRequest(
        "?page=1&limit=10"
      );
      setTotalCases((await firstPage).totalCases);
      setResponse(await firstPage);
      return firstPage;
    }
    initialRequest();
  }, []);

  async function fetchAllCases() {
    const fetchCases: Promise<CaseObject> = await makeApiRequest(
      `?page=1&limit=${totalCases}`
    );
    setAllCases(await fetchCases);
    setIsSearching(true);
    setCurrentPage(1);
    return allCases;
  }
  function searchFilter(search: string) {
    const filteredArray = allCases!.data.filter(
      (element: CaseObject["data"][0]) => {
        return element.patient.toLowerCase().includes(search.toLowerCase());
      }
    );
    const filteredBreed = allCases!.data.filter((element) => {
      return element.species.toLowerCase().includes(search.toLowerCase());
    });

    const result = filteredBreed.reduce(
      (acc, item) => {
        return acc.includes(item) ? acc : [...acc, item];
      },
      [...filteredArray]
    );
    return {
      rows: result.slice((currentPage - 1) * 10, currentPage * 10),
      pages: Math.ceil(result.length / 10),
    };
  }

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const value: string = e.currentTarget.value;
    if (value.length != search.length) {
      setCurrentPage(1);
    }
    setSearch(value);
  }
  async function nextPage() {
    const maxPage = isSearching
      ? searchFilter(search).pages
      : Math.ceil(totalCases / 10);
    const nextPage: number = currentPage + 1;
    if (nextPage > maxPage) {
      return <></>;
    } else {
      const fetchNextPage: Promise<CaseObject> = await makeApiRequest(
        `?page=${nextPage}&limit=10`
      );
      setCurrentPage(nextPage);
      setResponse(await fetchNextPage);

      return fetchNextPage;
    }
  }
  async function prevPage() {
    const prevPage: number = currentPage - 1;
    if (prevPage <= 0) {
      return <></>;
    } else {
      const fetchPrevPage: Promise<CaseObject> = await makeApiRequest(
        `?page=${prevPage}&limit=10`
      );
      setCurrentPage(prevPage);
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
      <div>
        <input
          type="text"
          placeholder="search"
          onChange={handleChange}
          value={search}
        />
        <button
          onClick={() => {
            fetchAllCases();
          }}
        >
          {" "}
          search
        </button>
        <div className="casesTableContainer">
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
              {isSearching
                ? searchFilter(search).rows.map(
                    (element: CaseObject["data"][0]) => {
                      return <Row key={element.id} row={element} />;
                    }
                  )
                : response.data.map((element: CaseObject["data"][0]) => {
                    return <Row key={element.id} row={element} />;
                  })}
            </tbody>
          </table>
        </div>
        <div className="casesPageContainer">
          {" "}
          <button onClick={() => prevPage()}>Previous Page</button>
          <p> {currentPage} </p>
          <button onClick={() => nextPage()}>Next Page</button>
        </div>
      </div>
    );
  }
}

export default CasesView;
