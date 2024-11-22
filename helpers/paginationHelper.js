module.exports = (paginationObject, query, countTask) => {
    if(query.page){
        paginationObject.currentPage = parseInt(query.page);
    }
    if(query.limit){
        paginationObject.limitItems = parseInt(query.limit);
    }
    paginationObject.skip = (paginationObject.currentPage - 1) * paginationObject.limitItems;
    paginationObject.totalPage = Math.ceil(countTask/paginationObject.limitItems);
    return paginationObject
}

