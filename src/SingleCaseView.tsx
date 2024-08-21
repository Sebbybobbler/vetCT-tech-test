import { useParams } from "react-router-dom";
import { makeApiRequest } from "./services/apiService";
import { useEffect, useState } from "react";
import { CaseObject } from "./CasesView";
import "./SingleCaseView.css";

function SingleCaseView() {
    const { caseId } = useParams();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [detailedResponse, setDetailedResponse] = useState<any>(null);

    useEffect(() => {
        async function initialDetailedRequest(): Promise<CaseObject> {
            const allCases: Promise<CaseObject> = await makeApiRequest(
                `/${caseId}`
            );
            setDetailedResponse(await allCases);
            return allCases;
        }
        initialDetailedRequest();
    }, [caseId]);
    if (!detailedResponse) {
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
                <div className="patientInfoBox">
                    <img
                        src={detailedResponse.data.image_url}
                        alt="image of patient"
                    />
                    <h2>{detailedResponse.data.patient}</h2>
                    <h3>Owner: {detailedResponse.data.owner}</h3>
                    <h3>Species: {detailedResponse.data.species}</h3>
                    <h2>{detailedResponse.data.turnaround}</h2>
                    <h3>
                        date created: {detailedResponse.data.creation_date}{" "}
                    </h3>
                </div>
                <div className="patientReport">
                    <h3>
                        Specialist: {detailedResponse.data.reporting_specialist}
                    </h3>
                    <h3>Specialty: {detailedResponse.data.specialty}</h3>
                    <h3>Reported: {detailedResponse.data.reported_date}</h3>
                    <h3>Body Areas: {detailedResponse.data.body_areas}</h3>
                    <h2> {detailedResponse.data.status}</h2>
                </div>
            </>
        );
    }
}

export default SingleCaseView;
