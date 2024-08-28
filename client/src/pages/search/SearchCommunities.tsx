// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Post from "../../components/communityAndEvent/Post";
// import CatSearchList from "../../components/search/CatSearchList";
// import LoadingCat from "../../components/loading/LoadingCat";
// import "../../styles/scss/pages/search/search.scss";

// const SearchPage = () => {
//   const [keyword, setKeyword] = useState("");
//   const [results, setResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1); // 현재 페이지
//   const [pageSize] = useState(10); // 페이지 크기
//   const [totalPages, setTotalPages] = useState(0); // 총 페이지 수

//   const fetchSearchResults = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get("/api/search", {
//         params: {
//           query: keyword,
//           page,
//           pageSize,
//         },
//       });
//       const { data } = response;
//       setResults(data);
//       setTotalPages(Math.ceil(data[0].totalcount.value / pageSize)); // 첫 번째 카테고리 기준으로 총 페이지 수 계산
//     } catch (error) {
//       console.error("Error fetching search results:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (keyword) {
//       fetchSearchResults();
//     }
//   }, [page, keyword]);

//   const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setPage(1); // 검색 시 페이지를 1로 초기화
//     fetchSearchResults();
//   };

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setPage(newPage);
//     }
//   };

//   return (
//     <div className="search-container">
//       <form onSubmit={handleSearch} className="search-form">
//         <input
//           type="text"
//           value={keyword}
//           onChange={(e) => setKeyword(e.target.value)}
//           className="search-input"
//           placeholder="검색어를 입력해 주세요."
//         />
//         <button type="submit" className="search-button">
//           검색
//         </button>
//       </form>

//       {isLoading && <LoadingCat />}

//       {results.length > 0 && !isLoading && (
//         <div className="search-results">
//           {results.map((category) => (
//             <div key={category.category} className="category-container">
//               <h2 className="category-title">
//                 {category.category} 검색 결과 ({category.totalcount.value}건)
//               </h2>
//               <div className="results-container">
//                 {category.category === "communities" ||
//                 category.category === "events" ? (
//                   category.search.map((result) => (
//                     <div key={result._id} className="result">
//                       <Post post={result._source} />
//                     </div>
//                   ))
//                 ) : (
//                   <CatSearchList
//                     posts={category.search}
//                     category={category.category}
//                   />
//                 )}
//               </div>
//             </div>
//           ))}

//           <div className="pagination">
//             <button
//               onClick={() => handlePageChange(page - 1)}
//               disabled={page === 1}
//             >
//               이전
//             </button>
//             <span>
//               {page} / {totalPages}
//             </span>
//             <button
//               onClick={() => handlePageChange(page + 1)}
//               disabled={page === totalPages}
//             >
//               다음
//             </button>
//           </div>
//         </div>
//       )}

//       {!isLoading && results.length === 0 && (
//         <div className="search-no-results">
//           <span>검색 결과가 없습니다.</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchPage;
