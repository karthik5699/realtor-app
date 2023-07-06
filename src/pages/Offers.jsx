import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";


export default function Offers() {

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(8));
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetch(lastVisible);
        let listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setListings(listings);
        setLoading(false)

      } catch (error) {
        toast.error("Failed to get offers.")
      }
    }
    fetchListings();
  }, [])

  const onFetchMoreListings = async () => {
    try {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("offer", "==", true), orderBy("timestamp", "desc"), startAfter(lastFetch), limit(4));
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetch(lastVisible);
      let listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false)

    } catch (error) {
      toast.error("Failed to get offers.")
    }
  }

  if(loading){
    return <Spinner />
  }

  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl text-center mt-6 font-bold mb-6">Offers</h1>
      {listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => (
                <ListingItem listing={listing.data} key={listing.id}/>
              ))}
            </ul>
          </main>
          {lastFetch && (
            <div className="flex justify-center items-center">
              <button onClick={onFetchMoreListings} className="bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 shadow-md hover:border-slate-600 transition rounded duration-150 ease-in-out">
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current offers.</p>
      )}
    </div>
  )
}
