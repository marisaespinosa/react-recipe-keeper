import { useEffect, useState } from "react"

export const useFetch = (url, method = "GET") => {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [options, setOptions] = useState(null);

    const postData = (postData) => {
        setOptions({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postData)
        });
    }

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async(fetchOptions) => {
            setIsLoading(true);

            try {
                const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const json = await response.json();
                console.log('Fetch json:'+JSON.stringify(json));
                setIsLoading(false);
                setData(json);
                setError(null);

            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Fetch was aborted');
                } else {
                    setIsLoading(false);
                    setError('Could not fetch data');
                    console.log(err.message);
                }
            }
            
        }

        if (method === "GET") {
            fetchData();
        }
        if (method === "POST" && options) {
            fetchData(options);
        }

        // cleanup function
        return () => {
            controller.abort()
        }
    }, [url, options, method])

    return { data, isLoading, error, postData }
}