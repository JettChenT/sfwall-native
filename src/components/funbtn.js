import React from 'react'
import { Link } from 'react-router-dom'

/**
   * PurgeCSS:
   * from-red-500
   * from-green-500
   * from-yellow-500
   * from-gray-500
   * from-purple-500
   * from-indigo-500
   * from-blue-500
   * from-pink-500
   * to-red-500
   * to-green-500
   * to-yellow-500
   * to-gray-500
   * to-purple-500
   * to-indigo-500
   * to-blue-500
   * to-pink-500
   * bg-red-900
   * bg-green-900
   * bg-yellow-900
   * bg-gray-900
   * bg-purple-900
   * bg-indigo-900
   * bg-blue-900
   * bg-pink-900
*/

const FunBtn = ( {title, description, action, actDesc, fcolor="purple", tcolor="indigo", disabled=false, ...rest} ) => {
    return (
        <div className={`bg-gradient-to-br from-${fcolor}-500 to-${tcolor}-500 p-8 text-white rounded-3xl mt-1 mx-5 w-auto transition duration-200 ease-in-out flex-1`} {...rest}>
           <div>
               <span className="block mb-3 font-bold text-xl md:text-2xl">
                    {title}
               </span>
               <span className="block font-semibold font-sans text-md">
                    {description}
               </span>
            </div> 
            <button 
                onClick={()=>action()} 
                className={`mt-5 py-2 px-4 bg-${fcolor}-900 bg-opacity-50 hover:bg-opacity-70 rounded-xl inline-block font-bold disabled:opacity-25`}
                disabled={disabled}
            >
                {actDesc}
            </button>
        </div>
    )
}

export default FunBtn;