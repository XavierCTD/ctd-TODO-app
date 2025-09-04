function TodosViewForm ({sortDirection , setSortDirection, sortField, setSortField, queryString, setQueryString}) {
   const preventRefresh = (event) => event.preventDefault();

    return (
        <form onSubmit={preventRefresh}>
       <div>
        <label>Search todos:</label>
        <input type="text" value={queryString} onChange={(event) => setQueryString(event.target.value)}/>
        <button type="button" onClick={() => setQueryString("")}>Clear</button>
       </div>

       <div>
        <label>Sort by</label>
        <select onChange={(event) => setSortField(event.target.value)} value={sortField}>
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
        </select>

        <label>Direction</label>
        <select onChange={(event) => setSortDirection(event.target.value)} value={sortDirection}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
        </select>
       </div>
       </form>
    );
}

export default TodosViewForm;