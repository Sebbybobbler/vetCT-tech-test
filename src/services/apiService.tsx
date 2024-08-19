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
    const response = await fetch(
        `https://jr-tech-test-1.vercel.app/api/cases${url}`,
        options
    );

    if (response.status >= 400) {
        const data = await response.json();
        throw new Error(data.error || "Fetch failed");
    }
    return await response.json();
}
