// Async function to fetch data from a text file
export const fetchFileContent = async (fileContent, loading, error) => {
    try {
        const response = await fetch('assets/prints.txt');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        fileContent.value = text;
    } catch (err) {
        error.value = err.toString();
    } finally {
        loading.value = false;
    }
};