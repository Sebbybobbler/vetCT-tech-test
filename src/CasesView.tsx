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

    useEffect(() => {
        async function initialRequest(): Promise<CaseObject> {
            const allCases: Promise<CaseObject> = await makeApiRequest("");
            setResponse((await allCases).data);
            return allCases;
        }
        initialRequest();
    }, []);
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
                        {response.map(
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
