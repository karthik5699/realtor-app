/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import {v4 as uuidv4} from "uuid";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router";


const EditListing = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null)

    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {}
    })
    const {type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice, discountedPrice, latitude, longitude, images} = formData;

    const params = useParams();

    useEffect(() => {
        if(listing && listing.userRef !== auth.currentUser.uid){
            toast.error("You cannot edit this listing")
            navigate("/")
        }
    }, [auth.currentUser.uid, navigate, listing])

    useEffect(()=> {
        setLoading(true);
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setListing(docSnap.data());
                setFormData({...docSnap.data()});
                setLoading(false);
            }else{
                navigate("/");
                toast.error("Listing does not exist")
            }
        }
        fetchListing()
    }, [params.listingId, navigate]);

   
    
    const onChange = (event) => {
        let boolean = null;
        if(event.target.value === "true"){
            boolean = true;
        }
        if(event.target.value === "false"){
            boolean = false;
        }

        if(event.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                images: event.target.files
            }))
        }

        if (!event.target.files) {
            setFormData((prevState) => ({
                ...prevState,
                [event.target.id]: boolean ?? event.target.value
            }))
        }
        
    }

    const storeImage = async(image) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage();
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, image);

            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed', 
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                }
            }, 
            (error) => {
                reject(error);
            }, 
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
                });
            }
            );

        })
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        if(discountedPrice >= regularPrice){
            setLoading(false);
            toast.error("Discount price must be less than regular price");
            return;
        }
        if(images.length > 6){
            toast.error("Choose < 6 images");
            return;
        }
        let geoLocation = {};
        geoLocation.lat = latitude;
        geoLocation.lng = longitude;

        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))).catch((error)=>{
                setLoading(false)
                toast.error("Images were not uploaded")
                return;
            }
        )
        const formDataCopy = {
            ...formData,
            imgUrls,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        };
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        const docRef = doc(db, "listings", params.listingId)
        await updateDoc(docRef, formDataCopy);
        setLoading(false);
        toast.success("Listing successful!");
        navigate(`/profile`)
    }

    

    if(loading){
        return <Spinner />
    }

    return (
        <main className="max-w-md px-2 mx-auto">
            <h1 className="text-3xl text-center mt-6 font-semibold">Edit Listing</h1>
            <form onSubmit={onSubmit}>
                <p className="text-lg mt-6 font-medium">Sell / Rent</p>
                <div className="flex">
                    <button type="button" id="type" value="sale" 
                            onClick={onChange} 
                            className={`mt-4 mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                      hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                      duration-150 ease-in-out w-full ${
                                        type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"
                                      }`}
                    >
                        Sell
                    </button>
                    <button type="button" id="type" value="rent" 
                            onClick={onChange} 
                            className={`mt-4 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                      hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                      duration-150 ease-in-out w-full ${
                                        type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"
                                      }`}
                    >
                        Rent
                    </button>
                </div>
                <p className="text-lg mt-6 font-medium">Name</p>
                <input type="text" id="name" value={name} 
                       onChange={onChange} placeholder="Name" maxLength="32" minLength="5" required
                       className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
                                  transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600
                                  mb-6"
                />
                <div className="flex space-x-6 mb-6">
                    <div>
                        <p className="text-lg font-semibold">Beds</p>
                        <input type="number" id="bedrooms" value={bedrooms} onChange={onChange} min="1" max="50" required
                               className="w-full px-4 py-2 text-xl text-gray-300 bg-white border border-gray-700 rounded transition
                                          duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
                        />
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Baths</p>
                        <input type="number" id="bathrooms" value={bathrooms} onChange={onChange} min="1" max="50" required
                               className="w-full px-4 py-2 text-xl text-gray-300 bg-white border border-gray-700 rounded transition
                                          duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
                        />
                    </div>
                </div>
                <p className="text-lg mt-6 font-medium">Parking spot</p>
                <div className="flex">
                    <button type="button" id="parking" value={true} 
                            onClick={onChange} 
                            className={`mt-4 mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                      hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                      duration-150 ease-in-out w-full ${
                                        !parking ? "bg-white text-black" : "bg-slate-600 text-white"
                                      }`}
                    >
                        Yes
                    </button>
                    <button type="button" id="parking" value={false} 
                            onClick={onChange} 
                            className={`mt-4 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                      hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                      duration-150 ease-in-out w-full ${
                                        parking ? "bg-white text-black" : "bg-slate-600 text-white"
                                      }`}
                    >
                        No
                    </button>
                </div>
                <p className="text-lg mt-6 font-medium">Furnished</p>
                <div className="flex">
                    <button type="button" id="furnished" value={true} 
                            onClick={onChange} 
                            className={`mt-4 mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                      hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                      duration-150 ease-in-out w-full ${
                                        !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                                      }`}
                    >
                        Yes
                    </button>
                    <button type="button" id="furnished" value={false} 
                            onClick={onChange} 
                            className={`mt-4 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                      hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                      duration-150 ease-in-out w-full ${
                                        furnished ? "bg-white text-black" : "bg-slate-600 text-white"
                                      }`}
                    >
                        No
                    </button>
                </div>
                <p className="text-lg mt-6 font-medium">Address</p>
                <textarea type="text" id="address" value={address} 
                       onChange={onChange} placeholder="Address" minLength="5" required
                       className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
                                  transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600
                                  mb-6"
                />
                {!geoLocationEnabled && (
                    <div className="flex items-center justify-start space-x-6 mb-6">
                        <div className="">
                            <p className="text-lg font-semibold">Latitude</p>
                            <input type="number" id="latitude" value={latitude} onChange={onChange} required className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"/>
                        </div>
                        <div className="">
                            <p className="text-lg font-semibold">Longitude</p>
                            <input type="number" id="longitude" value={longitude} onChange={onChange} required className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"/>
                        </div>
                    </div>
                )}
                <p className="text-lg font-medium">Description</p>
                <textarea type="text" id="description" value={description} 
                       onChange={onChange} placeholder="Description" minLength="5" required
                       className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded
                                  transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600
                                  mb-6"
                />
                <p className="text-lg font-medium">Offer</p>
                <div className="flex mb-6">
                    <button type="button" id="offer" value={true} 
                            onClick={onChange} 
                            className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                      hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                      duration-150 ease-in-out w-full ${
                                        !offer ? "bg-white text-black" : "bg-slate-600 text-white"
                                      }`}
                    >
                        Yes
                    </button>
                    <button type="button" id="offer" value={false} 
                            onClick={onChange} 
                            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded 
                                      hover:shadow-lg focus:shadow-lg active:shadow-lg transition
                                      duration-150 ease-in-out w-full ${
                                        offer ? "bg-white text-black" : "bg-slate-600 text-white"
                                      }`}
                    >
                        No
                    </button>
                </div>
                <div className="flex items-center mb-6">
                    <div className="">
                        <p className="text-lg font-semibold">Regular Price</p>
                        <div className="flex justify-center items-center space-x-6">
                            <input type="number" id="regularPrice" value={regularPrice} onChange={onChange} required min="500" max="100000000" className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-150 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                            {type === "rent" && (
                            <div className="">
                                <p className="text-md w-full whitespace-nowrap">Rs / Month</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
                {offer && (
                    <div className="flex items-center mb-6">
                    <div className="">
                        <p className="text-lg font-semibold">Discounted Price</p>
                        <div className="flex justify-center items-center space-x-6">
                            <input type="number" id="discountedPrice" value={discountedPrice} onChange={onChange} required={offer} min="500" max="100000000" className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-150 focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"/>
                            {type === "rent" && (
                            <div className="">
                                <p className="text-md w-full whitespace-nowrap">Rs / Month</p>
                            </div>
                        )}
                        </div>
                    </div>
                </div>
                )}
                <div className="mb-6">
                    <p className="text-lg font-semibold">Images</p>
                    <p className="text-gray-600">Upload clear images (max=6)</p>
                    <input type="file" id="images" onChange={onChange} accept=".jpg,.png,.jpeg" multiple required className="w-full px-3 py-1.5 text--gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white bg:border-slate-600"/>

                </div>
                <button type="submit" className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">
                    Update Listing
                </button>
            </form>
        </main>
    )
}

export default EditListing