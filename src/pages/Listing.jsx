import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay, EffectFade, Navigation, Pagination} from 'swiper';
import "swiper/css/bundle"

const Listing = () => {
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);


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
        <Swiper
      // install Swiper modules
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
    )
}

export default Listing