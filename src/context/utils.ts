/** Reads a stream of data */
export async function* readStreamChunks(
    url: string,
    options?: RequestInit
): AsyncGenerator<{ value: Uint8Array | undefined, done: boolean }, void, undefined> {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        if (!response.body) {
            throw new Error('Response body is null or undefined. No stream to read.');
        }

        const reader = response.body.getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                yield { done, value };
                break;
            }

            if (value) {
                yield { done, value };
            }
        }
    } catch (error) {
        console.error('Error reading stream:', error);
        throw error; // Re-throw to allow the caller to handle it.
    }
}
