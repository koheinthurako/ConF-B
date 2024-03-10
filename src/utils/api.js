const domain = "http://localhost:8081/"

async function get(path) {
    const resp = await fetch (
        domain+path, {
            method: 'GET'
        }
    );
    return resp;
}

export default({
    get
});