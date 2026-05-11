
const Searchbar = () => {
  return (
    <div className="flex-1 max-w-xl mx-10">
      <input
        type="text"
        placeholder="Search here..."
        className="w-full bg-gray-100 border-none rounded-full px-6 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
      />
    </div>
  )
}

export default Searchbar