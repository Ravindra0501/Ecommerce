import React from 'react'
import { useSearchParams } from 'react-router-dom'

const SortOptions = () => {
  const [searchParams,setSearchParams]=useSearchParams();

  const handleSortChange=(e)=>{
    const sortBy=e.target.value;
    searchParams.set("sortBy",sortBy)
    setSearchParams(searchParams)
  }

  return (
    <div className='mb-4 flex items-center justify-center'>
      <select  id="sort"
      onChange={handleSortChange}
      value={searchParams.get("sortBy") || ""}
      >
        <option value="">Deafult</option>
        <option value="priceAsc">Price:Low To High</option>
        <option value="priceDesc">Price:High To Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  )
}

export default SortOptions