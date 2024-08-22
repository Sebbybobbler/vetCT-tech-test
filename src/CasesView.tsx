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

function CasesView() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    async function initialRequest(): Promise<CaseObject> {
      const allCases: Promise<CaseObject> = await makeApiRequest("");
      setResponse((await allCases).data);
      return allCases;
    }
    initialRequest();
  }, []);

  function searchFilter(response: CaseObject["data"], search: string) {
    const filteredArray = response.filter((element) => {
      return element.patient.toLowerCase().includes(search.toLowerCase());
    });
    const filteredBreed = response.filter((element) => {
      return element.species.toLowerCase().includes(search.toLowerCase());
    });

    return [...filteredArray, ...filteredBreed];
  }
  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const value: string = e.currentTarget.value;
    setSearch(value);
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
      </>
    );
  }
}

export default CasesView;
