/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React  from 'react';
import { Link } from "react-router-dom";
import {MdLocationOn} from 'react-icons/md'



const ListingItem = ({ listing, id }) => {
    return (
        <li className='relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition duration-150 ease-in-out m-[10px]'>
            <Link to={`/category/${listing.type}/${id}`} className='contents'>
                <img src={listing.imgUrls[0]} alt="apartment" className='h-[170px] w-full object-cover hover:scale-110 transition-scale duration-200 ease-in' 
                     loading='lazy'
                />
                <div className='w-full p-[10px]'>
                    <div className='flex items-center space-x-1'>
                        <MdLocationOn className='h-4 w-4 text-green-600'/>
                        <p className='font-semi-bold text-sm mb-[2px] text-gray-600 truncate'>{listing.address}</p>
                    </div>
                    <p className='font-semibold m-0 text-xl truncate'>{listing.name}</p>
                    <p className='text-[#457b9d] mt-2 font-semibold'>Rs. {listing.offer ? Number(listing.discountedPrice).toLocaleString('hi-IN') : Number(listing.regularPrice).toLocaleString('hi-IN')}
                       {listing.type === "rent" && " / month"}
                    </p>
                    <div className='flex items-center mt-[10px] space-x-3'>
                        <div className='flex items-center space-x-1'>
                            <p className='font-bold text-xs'>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : "1 bed"}</p>
                        </div>
                        <div className='flex items-center space-x-1'>
                            <p className='font-bold text-xs'>{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : "1 bath"}</p>
                        </div>
                    </div>
                </div>
                

            </Link>
        </li>
    )
}

export default ListingItem