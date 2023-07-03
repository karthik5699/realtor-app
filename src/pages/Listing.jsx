import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, EffectFade, Navigation, Pagination} from 'swiper';
import "swiper/css/bundle"
import {FiShare} from 'react-icons/fi'

const Listing = () => {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

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
        </main>
    )
}

export default Listing