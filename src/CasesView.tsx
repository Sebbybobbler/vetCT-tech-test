import { makeApiRequest } from "./services/apiService";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleArrowRight,
  faCircleArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Row from "./components/Row/Row";
import Header from "./components/Header/Header";
import "./assets/css/CasesView.css";

// Type definition of incoming object from API
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
  // State Hooks, most defined during initial useEffect API request.

  //response is the state that manages what is fed into the row component and populates the cases table
  const [response, setResponse] = useState<CaseObject | null>(null);

  // search is the state which is set to the string in the search bar
  const [search, setSearch] = useState<string>("");

  // Current page is the state which monitors the clients current page
  const [currentPage, setCurrentPage] = useState(1);

  // All cases is the state which containes a list of all cases, for use in search queries
  const [allCases, setAllCases] = useState<CaseObject | null>(null);

  // Boolean state which informs whether client has clicked search or not
  const [isSearching, setIsSearching] = useState(false);

  // totalCases is the state which tracks the total number of cases, whether that be from the vanilla response, or the total number of cases from a search query
  const [totalCases, setTotalCases] = useState(0);

  // maxPages is the state which monitors the maximum number of pages, given the amount of cases.
  const [maxPages, setMaxPages] = useState(1);

  // On initial render, a fetch request is sent via API service function and initial state is saved.
  useEffect(() => {
    async function initialRequest(): Promise<CaseObject> {
      const firstPage: Promise<CaseObject> = await makeApiRequest(
        "?page=1&limit=10"
      );
      setTotalCases((await firstPage).totalCases);
      setResponse(await firstPage);
      setMaxPages((await firstPage).totalPages);
      return firstPage;
    }
    initialRequest();
  }, []);

  // Fetches all cases and puts them into a single object, for use when searching as search query needs to be compared to all cases, not just first page.
  async function fetchAllCases() {
    const fetchCases: Promise<CaseObject> = await makeApiRequest(
      `?page=1&limit=${totalCases}`
    );
    setAllCases(await fetchCases);
    setIsSearching(true);
    setCurrentPage(1);
    return allCases;
  }

  // This function takes the search query as an argument and checks if it is included in patient name of species, then puts results into an array and returns an object with results
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

  // change handler function for search input, if client presses backspace, sets page back to 1.
  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const value: string = e.currentTarget.value;
    if (value.length != search.length) {
      setCurrentPage(1);
    }
    setSearch(value);
  }

  // Function for fetching next page, if user is searching it will search
  async function nextPage() {
    const maxPage = isSearching
      ? searchFilter(search).pages
      : Math.ceil(totalCases / 10);
    setMaxPages(maxPage);
    const nextPage: number = currentPage + 1;
    if (nextPage > maxPage) {
      return <></>;
    } else if (!isSearching) {
      const fetchNextPage: Promise<CaseObject> = await makeApiRequest(
        `?page=${nextPage}&limit=10`
      );
      setCurrentPage(nextPage);
      setResponse(await fetchNextPage);

      return fetchNextPage;
    } else {
      setCurrentPage(nextPage);
    }
  }
  async function prevPage() {
    const prevPage: number = currentPage - 1;
    if (prevPage <= 0) {
      return <></>;
    } else if (!isSearching) {
      const fetchPrevPage: Promise<CaseObject> = await makeApiRequest(
        `?page=${prevPage}&limit=10`
      );
      setCurrentPage(prevPage);
      setResponse(await fetchPrevPage);
      return fetchPrevPage;
    } else {
      setCurrentPage(prevPage);
    }
  }

  if (!response) {
    return (
      <>
        <Header />
        <h1 className="casesHeading">My Cases</h1>
        <div>
          <p>Loading...</p>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <div className="casesContainer">
          <h1 className="casesHeading">My Cases</h1>
          <div className="casesSearch">
            <input
              type="text"
              placeholder="Search Patient or Breed"
              onChange={handleChange}
              value={search}
            />
            <button
              className="casesPrimaryButton"
              onClick={() => {
                fetchAllCases();
              }}
            >
              {" "}
              Search
            </button>
          </div>
          <table className="casesTable">
            <thead>
              <tr>
                <th>Case Key</th>
                <th>Name</th>
                <th>Owner</th>
                <th>Specialty</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
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

          <div className="casesPageContainer">
            <div className="casesPageIcons">
              {currentPage == 1 ? (
                <></>
              ) : (
                <FontAwesomeIcon
                  className="pageIcon"
                  icon={faCircleArrowLeft}
                  onClick={() => prevPage()}
                  aria-label="Previous Page button"
                />
              )}

              <h2>{currentPage}</h2>
              {currentPage == maxPages ? (
                <></>
              ) : (
                <FontAwesomeIcon
                  className="pageIcon"
                  icon={faCircleArrowRight}
                  onClick={() => nextPage()}
                  aria-label="Next Page button"
                />
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default CasesView;
