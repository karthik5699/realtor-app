import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import {Autoplay, EffectFade, Navigation, Pagination} from 'swiper';
import "swiper/css/bundle"
import { useNavigate } from "react-router";


const Slider = () => {
    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5))
        const querySnap = await getDocs(q)
        let listings = [];
        querySnap.forEach((doc) => {
            listings.push({
            id: doc.id,
            data: doc.data()
            })
        })
        setListings(listings)
        setLoading(false)
        }
        fetchListings()
    }, [])

    if(loading){
        return <Spinner />
    }

    if(listings.length === 0){
        return <></>
    }


    return (listings && <>
        <Swiper
            modules={[Navigation, Pagination, EffectFade, Autoplay]}
            slidesPerView={1}
            navigation
            pagination={{ type: "progressbar" }}
            effect="fade"
            autoplay = {{delay: 3000}}
        >
            {listings.map(({id, data}) => (
                <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                    <div style={{background: `url(${data.imgUrls[0]}) center, no-repeat`, backgroundSize: "cover"}}
                         className="relative w-full h-[300px] overflow-hidden"
                    >
                    </div>
                    <p className="text-[#f1faee] absolute p-2 left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] rounded-br-3xl opacity-90 shadow-lg">{data.name}</p>
                    <p className="text-[#f1faee] absolute p-2 left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63947] rounded-br-3xl opacity-90 shadow-lg">
                    Rs.{data.offer ? Number(data.discountedPrice).toLocaleString('hi-IN') : Number(data.regularPrice).toLocaleString('hi-IN')}
                        {data.type === "rent" && " / month"}
                    </p>
                </SwiperSlide>
            ))}
        </Swiper>
    </>
    )
}

export default Slider

