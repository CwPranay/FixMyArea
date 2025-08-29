import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const lat = req.nextUrl.searchParams.get("lat");
    const lng = req.nextUrl.searchParams.get("lng");
    if (!lat || !lng) {
        return NextResponse.json({ message: "Latitude and Longitude are required" }, { status: 400 });
    }

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
     const res = await fetch(url,{
        headers:{
            'User-Agent':'FixMyArea/1.0 (contact:prngurav@gmail.com)',
            'Accept-Language':'en',
        },
        next:{revalidate:60}
     });
     if(!res.ok){
        return NextResponse.json({message:"Failed to fetch address"}, {status:500});
     }

     const data = await res.json();
     return NextResponse.json({
        address:data.display_name || null,
        components:data.address || {},
     });



}