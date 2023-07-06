import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, EffectFade, Navigation, Pagination} from 'swiper';
import "swiper/css/bundle"
import {FiShare} from 'react-icons/fi'
import {FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair} from 'react-icons/fa'
import {getAuth} from 'firebase/auth'
import Contact from "../components/Contact";

const Listing = () => {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [contactLandLord, setContactLandlord] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setListing(docSnap.data())
                setLoading(false);
            }
        }

        fetchListing();
    }, [params.listingId])

    if(loading) {
        return <Spinner />
    }


    return !loading && (
        <main>
            <Swiper
                modules={[Navigation, Pagination, EffectFade, Autoplay]}
                slidesPerView={1}
                navigation
                pagination={{ type: "progressbar" }}
                effect="fade"
                autoplay = {{delay: 3000}}
                >
                
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div className="w-full relative overflow-hidden h-[300px]" style={{backgroundSize: "cover", background: `url(${listing.imgUrls[index]}) center no-repeat`, maxWidth: "100%"}}>
                            
                        </div>
                    </SwiperSlide>
                ))}

                
            </Swiper>
            <div onClick={() => {navigator.clipboard.writeText(window.location.href); 
                                setShareLinkCopied(true);
                                setTimeout(() => {
                                    setShareLinkCopied(false)
                                }, 2000)
                         }} 
                 className="fixed top-[15%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
            >
                <FiShare className="text-lg text-slate-600"/> 
            </div>
            {shareLinkCopied && (
                <p className="fixed top-[25%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">Link Copied</p>
            )}

            <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
                <div className="w-full">
                    <p className="text-2xl font-bold mb-3 text-blue-900">
                        {listing.name} - Rs.{listing.offer ? Number(listing.discountedPrice).toLocaleString('hi-IN') : Number(listing.regularPrice).toLocaleString('hi-IN')}
                        {listing.type === "rent" ? " / month" : ""}
                    </p>
                    <p className="flex items-center mt-6 mb-3 font-semibold">
                        <FaMapMarkerAlt className="text-green-700 mr-1"/> 
                        {listing.address}
                    </p>
                    <div className="flex items-center justify-start space-x-4 w-[75%]">
                        <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
                            {listing.type === "rent" ? "Rent" : "Sale"}
                        </p>
                        {listing.offer && (
                            <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white font-semibold text-center shadow-md">
                                Rs. {Number(listing.regularPrice) - Number(listing.discountedPrice)} discount
                            </p>
                        )}
                    </div>
                    <p className="mt-3 mb-3">
                        <span className="font-semibold">Description - </span>
                        {listing.description}
                    </p>
                    <ul className="flex items-center space-x-2 lg:space-x-10 text-sm font-semibold mb-6">
                        <li className="flex items-center whitespace-nowrap">
                            <FaBed className="text-lg mr-1"/>
                            {Number(listing.bedrooms) > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaBath className="text-lg mr-1"/>
                            {Number(listing.bathrooms) > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaParking className="text-lg mr-1"/>
                            {listing.parking ? "Parking" : "No Parking"}
                        </li>
                        <li className="flex items-center whitespace-nowrap">
                            <FaChair className="text-lg mr-1"/>
                            {listing.furnished ? "Furnished" : "Not Furnished"}
                        </li>
                    </ul>
                    {listing.userRef !== auth.currentUser?.uid && !contactLandLord && (
                         <div className="mt-8">
                            <button className="px-7 py-3 bg-blue-600 text-white shadow-md font-medium text-sm uppercase rounded hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg text-center transition duration-150 ease-in-out"
                                    onClick={() => {setContactLandlord(true)}}
                            >
                                Contact
                            </button>
                        </div>
                    )}
                    {contactLandLord && (
                        <Contact userRef={listing.userRef} listing={listing}/>
                    )}
                   
                    
                </div>
                <div className="bg-blue-300 w-full h-[200px] lg:h-[400px] z-10 overflow-x-hidden"></div>
            </div>
        </main>
    )
}

export default Listing