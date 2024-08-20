import { makeApiRequest } from "./services/apiService";

interface CaseObject {
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
    const allCases: Promise<CaseObject> = makeApiRequest("");
    allCases.then((result) => {
        console.log(result.data);
    });

    return <></>;
}

export default CasesView;
