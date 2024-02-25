"use client";

import { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Image from 'next/image';
import b2p from './img/bplus.png'
import b2text from './img/bplustext.png'
import searchLogo from './img/srch.png'
import testwrite from './database';
import getAll from './database';
import bankIco from './img/bankIco.png'
import arrw from './img/arrow-90.png'
import loc from './img/loc.png'
import myloc from './img/my-loc.png'



const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [Windowheight, setHeight] = useState();
  const [Windowwidth, setWidth] = useState()
  const [currentPosition, setCurrentPosition] = useState(null);
  const [Markerdata, setMarkerdata] = useState(null)
  const [Markerload, setMarkerload] = useState(false)

  const [SearchBox, setSearchBox] = useState(false)
  const [Panelload, setPanelload] = useState(false)
  const [showLegend, setshowLegend] = useState(true)
  const [Paneldata, setPaneldata] = useState(null)
  const [Formtxt, setFormtxt] = useState()
  const [selectedBlood, setselectedBlood] = useState()



  useEffect(() => {
    dataLoad()
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });

      },
      error => {
        console.error('Error getting user location:', error);
      })




    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);






  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    scaleControl: false,
    rotateControl: false,
    styles: [
      {
        featureType: 'poi',
        stylers: [
          {
            visibility: 'off', // Hide all points of interest
          },
        ],
      },
    ]

  }

  const dataLoad = async () => {
    try {
      const x = await getAll().then((a) => { return a })
      setMarkerdata(x)
      setMarkerload(true)
    } catch (e) {
      console.log(e)
    }
  }


  const updateDimensions = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  }

  const openSearch = () => {
    setSearchBox(true)
  }

  const updateLoc = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });

      },
      error => {
        console.error('Error getting user location:', error);
      })

  }

  const openMmenu = async (data) => {
    const dat = await data
    setCurrentPosition({lat:data[2],lng:data[3]})
    setSearchBox(false)
    setshowLegend(false)
    setPaneldata(dat)
    setPanelload(true)
  }

  const closeMmenu = () => {
    setPanelload(false)
    setshowLegend(true)
    setSearchBox(false)
  }

  const handleInputChange = (event) => {
    setFormtxt(event);
    console.log(event)
  };

  function openGoogleMaps(latitude, longitude) {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  }

  const Mmenu = () => {
    console.log(Paneldata)
    return (
      <>
        <div className='absolute bottom-0 right-0 m-5 z-60 w-full h-2/5 sm:w-1/2 md:w-1/3 drop-shadow-2xl'>
          <div className="grid grid-cols-10 grid-rows-5 gap-2 w-full h-full">
            <div className="relative col-span-7">
              {/* <button onClick={() => { console.log('hi') }} className='absolute top-0 right-0 bg-[#c93030] hover:bg-[#ff5e5e] items-center content-center justify-center m-5 drop-shadow-2xl'>
                  <Image className='m-3' src={arrw} width={30} height={30} />
                </button> */}
              <div className='w-full h-full bg-[#c92929] rounded-lg items-center content-center justify-center py-5 pl-2'>

                <h1 className='text-[#ffffff] font-bold font-mono items-center content-center justify-center'>{Paneldata[0]}</h1>
                <h6 className='text-[#ffffff] font-medium font-mono text-sm items-center content-center justify-center'>{Paneldata[1]}</h6>

              </div>
            </div>
            <div className="col-span-2 col-start-8 ">
              <div className='w-full h-full bg-[#c92929] rounded-lg items-center content-center justify-center  px-5 py-5'>
                <button onClick={() => { openGoogleMaps(Paneldata[2],Paneldata[3]) }} className='bg-[#c92929] hover:bg-[#ff5e5e] items-center content-center justify-center px-5'>
                  <Image className='m-2' src={loc} width={30} height={30} />
                </button>
              </div>
            </div>
            <div className="col-start-10 ">
              <div className='w-full h-full bg-[#c92929] rounded-lg items-center content-center justify-center'>
                <button onClick={() => { closeMmenu() }} className='items-center content-center justify-center'>
                  <h1 className='items-center content-center justify-center py-7 px-6 text-xl'>X</h1>
                </button>
              </div>
            </div>
            <div className="col-span-10 row-span-4 row-start-2">
              <div className='w-full h-full bg-[#ffffff] outline outline-5 outline-[#c92929] rounded-lg items-center content-center justify-center '>

                <div className="w-full h-full grid grid-cols-2 grid-rows-4 gap-7 p-5">
                  <BloodUI data={['A+', Paneldata[4]['A+']]} />
                  <BloodUI data={['A-', Paneldata[4]['A-']]} />
                  <BloodUI data={['B+', Paneldata[4]['B+']]} />
                  <BloodUI data={['B-', Paneldata[4]['B-']]} />
                  <BloodUI data={['AB+', Paneldata[4]['AB+']]} />
                  <BloodUI data={['AB-', Paneldata[4]['AB-']]} />
                  <BloodUI data={['O+', Paneldata[4]['O+']]} />
                  <BloodUI data={['O-', Paneldata[4]['O-']]} />

                </div>

              </div>
            </div>
          </div>
        </div>
      </>
    )
  }


  const MarkMap = (data) => {
    const val = data['data']
    return (
      <Marker onClick={() => { openMmenu(val) }} position={{ lat: val[2], lng: val[3] }} icon={{
        url: 'https://i.ibb.co/2PrnqSN/bankIco.png',
      }} />
    )
  }

  const BloodUI = (data) => {
    console.log(Paneldata)
    const fDat = data['data']
    return (
      <div className="w-full h-full grid grid-cols-7 grid-rows-1 gap-2 items-center justify-center">
        <div className="col-span-2 w-full h-full bg-[#c92929] rounded-lg items-center justify-center px-2 py-2">
          <h1 className='items-center content-center justify-center text-xl'>{fDat[0]}</h1>
        </div>
        <div className="col-span-5 col-start-3 w-full h-full bg-[#c92929] rounded-lg items-center content-center justify-center px-2 py-2">
          <h1 className='text-xl'>{fDat[1] + ' mL'}</h1>
        </div>
      </div>
    )
  }


  // Assuming you have firebase imported and configured

  // Function to calculate the distance between two points using the Haversine formula
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance; // Distance in kilometers
  }


  const mainFun = async (currLoc, quality, quantity) => {
    console.log(currLoc,quality,quantity)
    try {
      const x = await getAll().then((a) => { return a })
      x.forEach((elem) => {
        elem.push(calculateDistance(currLoc['lat'], currLoc['lng'], elem[2], elem[3]))
      })
      console.log(x)
      const sortedList = x.slice().sort((a, b) => a[5] - b[5]);

      const finalList = []

      sortedList.forEach((elem) => {
        if (elem[4][quality] >= quantity) {
          finalList.push(elem)
        }
        console.log(finalList)
      })



      return finalList[0]


    } catch (e) {

    }

  }








  return (
    <div className='relative'>
      <div className='absolute flex z-10 w-1/2 h-24 bg-white rounded-lg items-center content-center justify-center m-5 lg:w-1/5 drop-shadow-2xl'>
        <Image src={b2p} width={50} height={50} />
        <Image src={b2text} width={150} height={100} className='pl-5' />
      </div>


      <div>
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            className='z-50'
            mapContainerStyle={{ width: '100%', height: Windowheight }}
            center={currentPosition || { lat: 0, lng: 0 }}
            zoom={15}
            onLoad={() => { console.log('ready') }}
            onUnmount={() => { console.log('ready') }}
            options={mapOptions}

          >
            <Marker
              position={currentPosition}
              icon={{
                url: 'https://i.ibb.co/HDhNPdK/currLoc.png',
              }}
              onClick={() => { getAll() }}
            />
            {Markerload ? Markerdata.map((e) => <MarkMap data={e} />) : null}
          </GoogleMap>
        </LoadScript>
      </div>

      {SearchBox ?
        <>
          <div className='items-center content-center justify-center '>
            <div className='absolute bottom-0 right-0 m-5 z-60 w-full h-1/2.5s sm:w-1/2 md:w-1/3  bg-[#ffffff] outline outline-5 outline-[#c92929]absolute bottom-0 right-0 m-5 z-60 w-full h-1/4 sm:w-1/2 md:w-1/3  bg-[#ffffff] outline outline-5 outline-[#c92929] rounded-lg items-center content-center justify-center  drop-shadow-2xl'>
              <div className="grid grid-cols-8 grid-rows-4 gap-1 pl-2 pr-2">
                <div className="col-span-8">
                  <h1 className='text-[#c92929] font-bold font-mono p-5'>Search Nearest Blood Bank</h1>
                  <button className='absolute top-0 right-0 m-5'><h4 className='text-[#c92929]'>X</h4></button>
                  <div className='w-9/10 h-0.5 bg-[#c92929] items-center content-center justify-center' />
                </div>
                <div className="flex col-span-8 row-start-2">
                  <input value={Formtxt} onChange={(e) => { handleInputChange(e.target.value) }} type="number" pattern="\d*" class="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 border outline outline-10 outline-[#c92929] mt-5 rounded-full" />
                  <h3 className='text-black pt-10 px-2'>mL</h3>
                </div>

                <div className="row-start-3">
                  <button onClick={()=>setselectedBlood('A+')} className='w-full h-full bg-[#c92929] rounded-xl hover:bg-[#b63534] active:bg-[#b63534]'>A+</button>
                </div>
                <div className="row-start-3">
                  <button onClick={()=>setselectedBlood('A-')} className='w-full h-full bg-[#c92929] rounded-xl hover:bg-[#b63534] active:bg-[#b63534]'>A-</button>
                </div>
                <div className="row-start-3">
                  <button onClick={()=>setselectedBlood('B+')} className='w-full h-full bg-[#c92929] rounded-xl hover:bg-[#b63534] active:bg-[#b63534]'>B+</button>
                </div>
                <div className="row-start-3">
                  <button onClick={()=>setselectedBlood('B-')} className='w-full h-full bg-[#c92929] rounded-xl hover:bg-[#b63534] active:bg-[#b63534]'>B-</button>
                </div>
                <div className="row-start-3">
                  <button onClick={()=>setselectedBlood('AB+')} className='w-full h-full bg-[#c92929] rounded-xl hover:bg-[#b63534] active:bg-[#b63534]'>AB+</button>
                </div>
                <div className="row-start-3">
                  <button onClick={()=>setselectedBlood('AB-')} className='w-full h-full bg-[#c92929] rounded-xl hover:bg-[#b63534] active:bg-[#b63534]'>AB-</button>
                </div>
                <div className="row-start-3">
                  <button onClick={()=>setselectedBlood('O+')} className='w-full h-full bg-[#c92929] rounded-xl hover:bg-[#b63534] active:bg-[#b63534]'>O+</button>
                </div>
                <div className="row-start-3">
                  <button onClick={()=>setselectedBlood('O-')} className='w-full h-full bg-[#c92929] rounded-xl hover:bg-[#b63534] active:bg-[#b63534]'>O-</button>
                </div>
                <div className="col-span-8 w-full h-full ">
                  <button onClick={() => { openMmenu(mainFun(currentPosition, selectedBlood, Number(Formtxt))) }} className='w-full h-3/4 mt-2 bg-[#c92929] rounded-xl hover:bg-[#b63534] active:bg-[#b63534]'>SEARCH</button>
                </div>
              </div>


            </div>
          </div>
        </>
        :
        <>
          {showLegend ?
            <>
              <div className='fixed bottom-0 right-0 flex flex-col gap-y-1 z-50'>
                <button onClick={() => { updateLoc() }} className=' bg-[#c92929] hover:bg-[#ff5e5e] rounded-full items-center content-center justify-center m-5 drop-shadow-2xl'>
                  <Image className='m-5' src={myloc} width={30} height={30} />
                </button>
                <button onClick={() => { openSearch() }} className='bg-[#c92929] hover:bg-[#ff5e5e] rounded-full items-center content-center justify-center m-5 drop-shadow-2xl'>
                  <Image className='m-5' src={searchLogo} width={30} height={30} />
                </button>
              </div>
            </> : null}
        </>
      }


      {Panelload ?
        <>
          <Mmenu />
        </> :
        null}

    </div >


  );
};

export default MapComponent;
