export async function makeApiRequest(
    url: string,
    options: {
        headers: {
            "Content-Type": string;
        };
    } = {
        headers: { "Content-Type": "application/json" },
    }
) {
    try {
        const response = await fetch(
            `https://jr-tech-test-1.vercel.app/api/cases${url}`,
            options
        );
        if (response.ok) {
            const jsonResponse = await response.json();
            return await jsonResponse;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error);
    }
}
