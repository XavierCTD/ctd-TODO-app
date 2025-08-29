function TodosViewForm ({sortDirection , setSortDirection, sortField, setSortField}) {
    return (
       <div>
        <label>Sort by</label>
        <select onChange={(event) => setSortField(event.target.value)} value={sortField}>
            <option value="title">Title</option>
            <option value="createdTime">Time added</option>
        </select>
        <label>Direction</label>
        <select onChange={(event) => setSortDirection(event.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
        </select>
       </div>
    );
};

export default TodosViewForm;